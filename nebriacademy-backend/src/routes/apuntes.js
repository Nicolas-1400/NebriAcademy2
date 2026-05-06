// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");

const cloudinary = require("./cloudinary");
const Apuntes = require("../models/Apuntes.js");
const Administradores = require("../models/Administradores.js");
const Profesores = require("../models/Profesores.js");
const Alumnos = require("../models/Alumnos.js");
const Cursos = require("../models/Cursos.js");
const Notificaciones = require("../models/Notificaciones.js");
const CursosAlumnos = require("../models/CursosAlumnos.js");
const ProfesoresCursos = require("../models/ProfesoresCursos.js");

// ── CONFIGURACIÓN (multer) ──────────────────────────────────────────────────
// Usamos memoryStorage: el archivo queda en RAM y lo subimos directamente a Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

// ── HELPER: subir buffer a Cloudinary ────────────────────────────────────────
// Devuelve una Promise con el resultado de Cloudinary (secure_url, public_id...)
function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_chunked_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

function extractPublicId(url, resourceType) {
  try {
    const parts = url.split('/');
    const uploadIdx = parts.indexOf('upload');
    const afterUpload = parts.slice(uploadIdx + 2);
    const publicIdWithExt = afterUpload.join('/');
    return resourceType === 'raw' ? publicIdWithExt : publicIdWithExt.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}

// Extrae el resource_type real de la URL de Cloudinary para borrados correctos
function getResourceTypeFromUrl(url) {
  if (url.includes('/image/upload/')) return 'image';
  if (url.includes('/video/upload/')) return 'video';
  return 'raw';
}

// ── GET ─────────────────────────────────────────────────────────────────────
// GET /apuntes — Devuelve todos los apuntes registrados
router.get("/", async (req, res) => {
  try {
    const data = await Apuntes.findAll();
    res.json({ "Numero de apuntes": data.length, Apuntes: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /apuntes/categorias — Devuelve los valores del ENUM de categorias definidos en el modelo
router.get("/categorias", (req, res) => {
  try {
    const categ = Apuntes.getAttributes()?.categoria?.values || [];
    res.json({ categorias: categ });
  } catch (e) {
    res.status(500).json({ categorias: [] });
  }
});

// GET /apuntes/:id — Devuelve un apunte concreto por su ID
router.get("/:id", async (req, res) => {
  try {
    const apunte = await Apuntes.findByPk(req.params.id);
    apunte
      ? res.json(apunte)
      : res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST ────────────────────────────────────────────────────────────────────
// POST /apuntes — Sube un nuevo apunte a Cloudinary y registra la URL en la BDD.
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido" });

    const {
      nombre,
      descripcion,
      curso: cursoId,
      profileId,
      tipo,
      categoria: categoriaInput,
    } = req.body;
    let categoria = categoriaInput || null;

    let autorFinal = null;

    // Según el tipo de usuario, buscamos su usuarioId para usarlo como autor del apunte
    if (tipo === "alumno") {
      const u = await Alumnos.findByPk(profileId);
      if (u) autorFinal = u.usuarioId;
    } else if (tipo === "profesor") {
      const u = await Profesores.findByPk(profileId);
      if (u) autorFinal = u.usuarioId;
    } else if (tipo === "administrador") {
      const u = await Administradores.findByPk(profileId);
      if (u) autorFinal = u.usuarioId;
    }

    if (!autorFinal)
      return res
        .status(400)
        .json({ error: "Autor no identificado o no encontrado" });

    // Si el apunte está asociado a un curso, heredamos la categoría de ese curso
    if (cursoId) {
      const c = await Cursos.findByPk(cursoId);
      if (c?.categoria) categoria = c.categoria;
    }

    if (!cursoId && !categoria)
      return res
        .status(400)
        .json({ error: "Categoría requerida si no hay curso" });

    // Subimos con resource_type "auto" para que Cloudinary detecte correctamente el tipo
    // (PDF → image, ZIP → raw, etc.) y sirva el archivo con los headers correctos
    const baseName = req.file.originalname
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_");
    const cloudResult = await uploadToCloudinary(req.file.buffer, {
      folder: "nebriacademy/apuntes",
      resource_type: "auto",
      public_id: baseName,
    });

    const nuevo = await Apuntes.create({
      autor: autorFinal,
      curso: cursoId || null,
      categoria,
      // Guardamos la URL pública de Cloudinary en lugar del nombre de archivo local
      archivo: cloudResult.secure_url,
      descripcion,
      valoracion: 0,
      nombre: nombre || req.file.originalname,
    });

    // --- NOTIFICACIONES ---
    try {
      if (cursoId) {
        const c = await Cursos.findByPk(cursoId);
        if (tipo === "profesor" || tipo === "administrador") {
          const apuntados = await CursosAlumnos.findAll({ where: { cursoId, apuntado: true } });
          const notificaciones = [];
          for (const ap of apuntados) {
            const al = await Alumnos.findByPk(ap.alumnoId);
            if (al) {
              notificaciones.push({
                usuarioId: al.usuarioId,
                tipoUsuario: "alumno",
                mensaje: `Nuevo apunte subido en el curso ${c ? c.nombreCurso : 'seleccionado'}`,
                enlace: `/Home/Courses/${cursoId}`
              });
            }
          }
          if (notificaciones.length > 0) await Notificaciones.bulkCreate(notificaciones);
        } else if (tipo === "alumno") {
          const arrProfesores = await ProfesoresCursos.findAll({ where: { cursoId } });
          const notificaciones = [];
          for (const pc of arrProfesores) {
            const p = await Profesores.findByPk(pc.profesorId);
            if (p) {
              const u = await Alumnos.findByPk(profileId);
              notificaciones.push({
                usuarioId: p.usuarioId,
                tipoUsuario: "profesor",
                mensaje: `El alumno ${u ? u.nombre : 'Anónimo'} ha subido un apunte al curso ${c ? c.nombreCurso : 'seleccionado'}`,
                enlace: `/Home/Courses/${cursoId}`
              });
            }
          }
          if (notificaciones.length > 0) await Notificaciones.bulkCreate(notificaciones);
        }
      }
    } catch (errNoti) {
      console.error("Error creando notificaciones (apuntes):", errNoti);
    }

    res.status(201).json({ id: nuevo.id, archivo: nuevo.archivo });
  } catch (error) {
    console.error("Error subida apunte:", error);
    res.status(500).json({ error: "Error creando apunte" });
  }
});

// ── PUT ─────────────────────────────────────────────────────────────────────
// PUT /apuntes/:id — Actualiza los datos de un apunte. Si se adjunta un archivo nuevo,
// se sube a Cloudinary y se borra el anterior de Cloudinary.
router.put("/:id", upload.single("archivo"), async (req, res) => {
  try {
    const apunte = await Apuntes.findByPk(req.params.id);
    if (!apunte) return res.status(404).json({ error: "No encontrado" });

    const updates = { ...req.body };

    if (req.file) {
      if (apunte.archivo && apunte.archivo.includes('cloudinary.com')) {
        try {
          const resourceType = getResourceTypeFromUrl(apunte.archivo);
          const pid = extractPublicId(apunte.archivo, resourceType);
          if (pid) await cloudinary.uploader.destroy(pid, { resource_type: resourceType });
        } catch (e) {
          console.warn('No se pudo borrar asset anterior de Cloudinary:', e.message);
        }
      }

      const baseName = req.file.originalname
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-zA-Z0-9._-]/g, "_");
      const cloudResult2 = await uploadToCloudinary(req.file.buffer, {
        folder: 'nebriacademy/apuntes',
        resource_type: 'auto',
        public_id: baseName,
      });
      updates.archivo = cloudResult2.secure_url;
    }

    const actualizado = await apunte.update(updates);
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando" });
  }
});

// ── DELETE ──────────────────────────────────────────────────────────────────
// DELETE /apuntes/:id — Elimina el apunte de la BDD y borra también el asset de Cloudinary
router.delete("/:id", async (req, res) => {
  try {
    const apunte = await Apuntes.findByPk(req.params.id);
    if (!apunte) return res.status(404).json({ error: "No encontrado" });

    if (apunte.archivo && apunte.archivo.includes('cloudinary.com')) {
      try {
        const resourceType = getResourceTypeFromUrl(apunte.archivo);
        const pid = extractPublicId(apunte.archivo, resourceType);
        if (pid) await cloudinary.uploader.destroy(pid, { resource_type: resourceType });
      } catch (e) {
        console.warn('No se pudo borrar asset de Cloudinary:', e.message);
      }
    }

    // Si se proporciona una razón (borrado por admin), notificamos al autor
    const { reason } = req.query;
    if (reason && apunte.autor) {
      try {
        await Notificaciones.create({
          usuarioId: apunte.autor,
          // Buscamos si es profesor o alumno para el tipoUsuario si fuese necesario, 
          // pero el mensaje es lo principal.
          mensaje: `Tu apunte "${apunte.nombre}" ha sido eliminado por un administrador. Razón: ${reason}`,
          fecha: new Date(),
        });
      } catch (errNotif) {
        console.warn("Error enviando notificación de borrado (apunte):", errNotif.message);
      }
    }

    await apunte.destroy();

    res.json({ mensaje: "Eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando" });
  }
});

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
