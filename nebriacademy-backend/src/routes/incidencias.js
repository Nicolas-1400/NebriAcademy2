// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

// ── CONFIGURACIÓN (multer) ──────────────────────────────────────────────────
// Carpeta temporal para guardar los archivos antes de enviarlos a Jira
const uploadDir = path.join(__dirname, "..", "temp_uploads");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // Creamos la carpeta justo antes de cada subida para garantizar que existe
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => cb(null, Date.now() + "-" + path.basename(file.originalname)),
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// ── CONFIGURACIÓN DE JIRA ───────────────────────────────────────────────────
const JIRA_URL = process.env.JIRA_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY;

const getJiraHeaders = () => {
  const authId = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
  return {
    'Authorization': `Basic ${authId}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

// Helper para crear un párrafo ADF con etiqueta en negrita + valor normal
const campoParagraph = (etiqueta, valor) => ({
  type: "paragraph",
  content: [
    { type: "text", text: `${etiqueta}: `, marks: [{ type: "strong" }] },
    { type: "text", text: valor || "—" }
  ]
});

// Helper para extraer texto plano de la descripción ADF de Jira
const extraerTextoADF = (doc) => {
  if (!doc || !doc.content) return "";
  return doc.content.map(bloque => {
    if (!bloque.content) return "";
    return bloque.content.map(n => n.text || "").join("");
  }).join("\n");
};

// ── POST /incidencias ───────────────────────────────────────────────────────
// Crea un nuevo ticket en Jira y le adjunta archivos si los hay
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    const { tipo, descripcion, usuario_id, usuario_nombre, usuario_tipo, usuario_email } = req.body;

    if (!JIRA_URL || !JIRA_EMAIL || !JIRA_API_TOKEN || !JIRA_PROJECT_KEY) {
      console.error("Faltan variables de entorno para Jira en el backend.");
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(500).json({ error: "El backend no está configurado para conectar con Jira." });
    }

    // Usamos el ID del usuario como label para poder buscar sus tickets con JQL
    const labelUsuario = `usuario-${usuario_id}`;

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
        labels: [labelUsuario]
      }
    };

    const issueResponse = await axios.post(
      `${JIRA_URL}/rest/api/3/issue`,
      issueData,
      { headers: getJiraHeaders() }
    );

    const issueKey = issueResponse.data.key;

    // Si hay un archivo adjunto, subirlo al ticket recién creado
    if (req.file) {
      const authId = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
      const form = new FormData();
      form.append('file', fs.createReadStream(req.file.path));

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

      fs.unlinkSync(req.file.path);
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
});

// ── GET /incidencias/mis-tickets/:usuarioId ──────────────────────────────────
// Devuelve todos los tickets del usuario con ese ID (busca por label en Jira)
router.get("/mis-tickets/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!JIRA_URL || !JIRA_EMAIL || !JIRA_API_TOKEN || !JIRA_PROJECT_KEY) {
      return res.status(500).json({ error: "El backend no está configurado para conectar con Jira." });
    }

    // Usamos IN para mayor compatibilidad con la API de Jira
    const jql = `project = "${JIRA_PROJECT_KEY}" AND labels IN ("usuario-${usuarioId}") ORDER BY created DESC`;

    console.log("Ejecutando JQL:", jql);

    const response = await axios.get(
      `${JIRA_URL}/rest/api/3/search`,
      {
        headers: getJiraHeaders(),
        params: {
          jql,
          fields: "summary,status,created,updated,priority,labels",
          maxResults: 50
        }
      }
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
    console.error("Error interno mis-tickets:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// ── GET /incidencias/ticket/:issueKey ────────────────────────────────────────
// Devuelve el detalle completo de un ticket y sus comentarios
router.get("/ticket/:issueKey", async (req, res) => {
  try {
    const { issueKey } = req.params;

    // Obtenemos el ticket completo junto con sus comentarios y adjuntos
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
    console.error("Error interno:", e.message);
    res.status(500).json({ error: "Error interno obteniendo ticket" });
  }
});

// ── POST /incidencias/ticket/:issueKey/comentario ────────────────────────────
// Añade un comentario del usuario al ticket
router.post("/ticket/:issueKey/comentario", async (req, res) => {
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
    res.status(201).json({
      id: c.id,
      autor: c.author?.displayName || "Desconocido",
      fecha: c.created,
      texto: extraerTextoADF(c.body)
    });

  } catch (e) {
    if (e.response) {
      console.error("Error añadiendo comentario en Jira:", JSON.stringify(e.response.data, null, 2));
      return res.status(500).json({ error: "Error añadiendo comentario", details: e.response.data });
    }
    console.error("Error interno:", e.message);
    res.status(500).json({ error: "Error interno añadiendo comentario" });
  }
});

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
