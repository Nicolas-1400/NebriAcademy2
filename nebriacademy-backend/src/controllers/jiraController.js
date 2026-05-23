// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const Administradores = require("../models/Administradores.js");
const Notificaciones = require("../models/Notificaciones.js");

// ── CONTROLADOR: jira ───────────────────────────────────────────────────────
// Integración con Jira: crear tickets, adjuntar archivos y consultar tickets/comentarios

const JIRA_URL = process.env.JIRA_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY;

// Construye los encabezados necesarios para llamar a la API REST de Jira
// Usa Basic Auth con correo+token (almacenados en variables de entorno)
const getJiraHeaders = () => {
  const authId = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
  return {
    'Authorization': `Basic ${authId}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

const normalizarParaLabel = (nombre) => {
  if (!nombre) return 'anonimo';
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
};

const campoParagraph = (etiqueta, valor) => ({
  type: "paragraph",
  content: [
    { type: "text", text: `${etiqueta}: `, marks: [{ type: "strong" }] },
    { type: "text", text: valor || "—" }
  ]
});

const extraerTextoADF = (doc) => {
  if (!doc || !doc.content) return "";
  return doc.content.map(bloque => {
    if (!bloque.content) return "";
    return bloque.content.map(n => n.text || "").join("");
  }).join("\n");
};

// Crear ticket en Jira, adjuntar archivo opcional y notificar administradores
exports.create = async (req, res) => {
  try {
    const { tipo, descripcion, usuario_id, usuario_nombre, usuario_tipo, usuario_email } = req.body;

    // Verificar configuración: asegurar variables de entorno necesarias
    if (!JIRA_URL || !JIRA_EMAIL || !JIRA_API_TOKEN || !JIRA_PROJECT_KEY) {
      console.error("Faltan variables de entorno para Jira en el backend.");
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(500).json({ error: "El backend no está configurado para conectar con Jira." });
    }

    // Preparar labels para identificar al usuario dentro de Jira
    const labelNombre = normalizarParaLabel(usuario_nombre);
    const labelId = `uid-${usuario_id}`;

    // Construir payload ADF (formato rich-text que Jira espera)
    const issueData = {
      fields: {
        project: { key: JIRA_PROJECT_KEY },
        summary: `[${tipo}] Incidencia reportada por ${usuario_nombre || 'usuario anónimo'}`,
        description: {
          type: "doc",
          version: 1,
          content: [
            campoParagraph("Usuario", usuario_nombre),
            campoParagraph("Correo", usuario_email),
            campoParagraph("ID", usuario_id),
            campoParagraph("Tipo de usuario", usuario_tipo),
            campoParagraph("Tipo de reporte", tipo),
            { type: "paragraph", content: [{ type: "text", text: "Descripción del usuario:", marks: [{ type: "strong" }] }] },
            { type: "paragraph", content: [{ type: "text", text: descripcion || "Sin descripción" }] },
          ]
        },
        issuetype: { name: "Task" },
        labels: [labelNombre, labelId]
      }
    };

    // Crear el issue en Jira (API REST)
    const issueResponse = await axios.post(
      `${JIRA_URL}/rest/api/3/issue`,
      issueData,
      { headers: getJiraHeaders() }
    );

    const issueKey = issueResponse.data.key;

    // Si hay un archivo en la petición, subirlo como attachment del issue
    if (req.file) {
      // Preparar multipart/form-data con el archivo
      const authId = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
      const form = new FormData();
      form.append('file', fs.createReadStream(req.file.path));

      // POST hacia el endpoint de attachments (requiere X-Atlassian-Token)
      await axios.post(
        `${JIRA_URL}/rest/api/3/issue/${issueKey}/attachments`,
        form,
        {
          headers: {
            'Authorization': `Basic ${authId}`,
            'Accept': 'application/json',
            'X-Atlassian-Token': 'no-check',
            ...form.getHeaders()
          }
        }
      );

      // Borrar el archivo temporal una vez subido
      fs.unlinkSync(req.file.path);
    }

    try {
      const admins = await Administradores.findAll();
      const notificaciones = admins.map(a => ({
        usuarioId: a.usuarioId,
        tipoUsuario: "administrador",
        mensaje: `Nuevo ticket de soporte en Jira de ${usuario_nombre || 'Anónimo'}`,
        enlace: `https://asistencianebriacademy.atlassian.net/jira/software/projects/KAN/list`
      }));
      if (notificaciones.length > 0) await Notificaciones.bulkCreate(notificaciones);
    } catch (errNoti) {
      console.error("Error creando notificaciones (jira):", errNoti);
    }

    res.status(201).json({ mensaje: "Ticket creado en Jira", ticket: issueKey });

  } catch (e) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    if (e.response) {
      console.error("Error de Jira API:", JSON.stringify(e.response.data, null, 2));
      return res.status(500).json({ error: "Error en Jira", details: e.response.data });
    }
    console.error("Error interno:", e.message);
    res.status(500).json({ error: "Error interno creando ticket en Jira" });
  }
};

// Listar tickets del usuario (filtrado por label con su uid)
exports.misTickets = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!JIRA_URL || !JIRA_EMAIL || !JIRA_API_TOKEN || !JIRA_PROJECT_KEY) {
      return res.status(500).json({ error: "El backend no está configurado para conectar con Jira." });
    }

    const labelId = `uid-${usuarioId}`;
    const jql = `project = ${JIRA_PROJECT_KEY} AND labels = "${labelId}" ORDER BY created DESC`;

    const response = await axios.post(
      `${JIRA_URL}/rest/api/3/search/jql`,
      {
        jql,
        fields: ["summary", "status", "created", "updated", "priority"],
        maxResults: 50
      },
      { headers: getJiraHeaders() }
    );

    const tickets = response.data.issues.map(issue => ({
      key: issue.key,
      id: issue.id,
      resumen: issue.fields.summary,
      estado: issue.fields.status?.name,
      prioridad: issue.fields.priority?.name,
      creado: issue.fields.created,
      actualizado: issue.fields.updated,
    }));

    res.json({ tickets });

  } catch (e) {
    if (e.response) {
      console.error("Error buscando tickets en Jira:", JSON.stringify(e.response.data, null, 2));
      return res.status(500).json({ error: "Error buscando tickets en Jira", details: e.response.data });
    }
    console.error("Error interno mis-tickets:", e.message, e.stack);
    res.status(500).json({ error: e.message });
  }
};

// Obtener detalle de un ticket (incluye comentarios y adjuntos)
exports.ticketDetail = async (req, res) => {
  try {
    const { issueKey } = req.params;

    const [issueRes, commentsRes] = await Promise.all([
      axios.get(
        `${JIRA_URL}/rest/api/3/issue/${issueKey}`,
        {
          headers: getJiraHeaders(),
          params: { fields: "summary,status,description,created,updated,priority,attachment" }
        }
      ),
      axios.get(
        `${JIRA_URL}/rest/api/3/issue/${issueKey}/comment`,
        { headers: getJiraHeaders() }
      )
    ]);

    const issue = issueRes.data;
    const descripcionTexto = extraerTextoADF(issue.fields.description);

    const comentarios = commentsRes.data.comments.map(c => ({
      id: c.id,
      autor: c.author?.displayName || "Desconocido",
      fecha: c.created,
      texto: extraerTextoADF(c.body)
    }));

    const adjuntos = (issue.fields.attachment || []).map(a => ({
      id: a.id,
      nombre: a.filename,
      url: a.content,
      mimeType: a.mimeType
    }));

    res.json({
      key: issue.key,
      resumen: issue.fields.summary,
      estado: issue.fields.status?.name,
      prioridad: issue.fields.priority?.name,
      creado: issue.fields.created,
      actualizado: issue.fields.updated,
      descripcion: descripcionTexto,
      comentarios,
      adjuntos
    });

  } catch (e) {
    if (e.response) {
      console.error("Error obteniendo ticket de Jira:", JSON.stringify(e.response.data, null, 2));
      return res.status(500).json({ error: "Error obteniendo ticket", details: e.response.data });
    }
    console.error("Error interno ticket:", e.message);
    res.status(500).json({ error: "Error interno obteniendo ticket" });
  }
};

// Añadir comentario a un ticket de Jira
exports.addComment = async (req, res) => {
  try {
    const { issueKey } = req.params;
    const { texto, usuario_nombre } = req.body;

    if (!texto || !texto.trim()) {
      return res.status(400).json({ error: "El comentario no puede estar vacío" });
    }

    const commentBody = {
      body: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              { type: "text", text: `${usuario_nombre || 'Usuario'}: `, marks: [{ type: "strong" }] },
              { type: "text", text: texto }
            ]
          }
        ]
      }
    };

    const response = await axios.post(
      `${JIRA_URL}/rest/api/3/issue/${issueKey}/comment`,
      commentBody,
      { headers: getJiraHeaders() }
    );

    const c = response.data;
    res.status(201).json({ id: c.id, autor: c.author?.displayName || "Desconocido", fecha: c.created, texto: extraerTextoADF(c.body) });

  } catch (e) {
    if (e.response) {
      console.error("Error añadiendo comentario en Jira:", JSON.stringify(e.response.data, null, 2));
      return res.status(500).json({ error: "Error añadiendo comentario", details: e.response.data });
    }
    console.error("Error interno comentario:", e.message);
    res.status(500).json({ error: "Error interno añadiendo comentario" });
  }
};

// Subir adjuntos a un ticket de Jira
exports.addAttachments = async (req, res) => {
  try {
    const { issueKey } = req.params;
    const archivos = req.files;

    if (!archivos || archivos.length === 0) {
      return res.status(400).json({ error: "No se ha enviado ningún archivo" });
    }

    const authId = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
    const adjuntosSubidos = [];

    for (const archivo of archivos) {
      const form = new FormData();
      form.append('file', fs.createReadStream(archivo.path));

      const response = await axios.post(
        `${JIRA_URL}/rest/api/3/issue/${issueKey}/attachments`,
        form,
        {
          headers: {
            'Authorization': `Basic ${authId}`,
            'Accept': 'application/json',
            'X-Atlassian-Token': 'no-check',
            ...form.getHeaders()
          }
        }
      );

      fs.unlinkSync(archivo.path);
      const dato = response.data[0];
      adjuntosSubidos.push({ id: dato.id, nombre: dato.filename, url: dato.content, mimeType: dato.mimeType });
    }

    res.status(201).json({ adjuntos: adjuntosSubidos });

  } catch (e) {
    if (req.files) req.files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
    if (e.response) {
      console.error("Error subiendo adjunto a Jira:", JSON.stringify(e.response.data, null, 2));
      return res.status(500).json({ error: "Error subiendo adjunto", details: e.response.data });
    }
    console.error("Error interno adjunto:", e.message);
    res.status(500).json({ error: "Error interno subiendo adjunto" });
  }
};
