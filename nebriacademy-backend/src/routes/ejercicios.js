// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");

const cloudinary = require("./cloudinary");
const Ejercicios = require("../models/Ejercicios.js");
const Profesores = require("../models/Profesores.js");
const Alumnos = require("../models/Alumnos.js");
const Cursos = require("../models/Cursos.js");
const CursosAlumnos = require("../models/CursosAlumnos.js");
const Notificaciones = require("../models/Notificaciones.js");

// ── CONFIGURACIÓN (multer) ──────────────────────────────────────────────────
const upload = multer({ storage: multer.memoryStorage() });

// ── HELPER ──────────────────────────────────────────────────────────────────
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
router.get("/", async (req, res) => {
  try {
    const all = await Ejercicios.findAll();
    res.json({ "Numero de ejercicios": all.length, Ejercicios: all });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const ej = await Ejercicios.findByPk(req.params.id);
    ej ? res.json(ej) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST ────────────────────────────────────────────────────────────────────
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido" });
    const { nombre, descripcion, curso, profileId, tipo } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });
    if (!profileId || !tipo) return res.status(400).json({ error: "Faltan datos de autor" });

    let profesorId = null;
    if (tipo === "profesor") {
      const prof = await Profesores.findByPk(profileId);
      if (prof) profesorId = prof.id;
    }

    if (!profesorId)
      return res.status(400).json({ error: "Profesor no identificado o no autorizado" });

    const baseName = req.file.originalname
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_");
    const cloudResult = await uploadToCloudinary(req.file.buffer, {
      folder: "nebriacademy/ejercicios",
      resource_type: "auto",
      public_id: baseName,
    });

    const nuevo = await Ejercicios.create({
      autor: profesorId,
      curso: curso || null,
      descripcion: descripcion || null,
      archivo: cloudResult.secure_url,
      nombre,
    });

    // --- NOTIFICACIONES ---
    try {
      if (curso) {
        const c = await Cursos.findByPk(curso);
        const apuntados = await CursosAlumnos.findAll({ where: { cursoId: curso, apuntado: true } });
        const notificaciones = [];
        for (const ap of apuntados) {
          const al = await Alumnos.findByPk(ap.alumnoId);
          if (al) {
            notificaciones.push({
              usuarioId: al.usuarioId,
              tipoUsuario: "alumno",
              mensaje: `Nuevo ejercicio subido en el curso ${c ? c.nombreCurso : 'seleccionado'}`,
              enlace: `/Home/Courses/${curso}`
            });
          }
        }
        if (notificaciones.length > 0) await Notificaciones.bulkCreate(notificaciones);
      }
    } catch (errNoti) {
      console.error("Error creando notificaciones (ejercicios):", errNoti);
    }

    res.status(201).json({ id: nuevo.id, archivo: nuevo.archivo });
  } catch (error) {
    console.error("Error creando ejercicio:", error);
    res.status(500).json({ error: "Error creando ejercicio" });
  }
});

// ── PUT ─────────────────────────────────────────────────────────────────────
router.put("/:id", upload.single("archivo"), async (req, res) => {
  try {
    const ej = await Ejercicios.findByPk(req.params.id);
    if (!ej) return res.status(404).json({ error: "No encontrado" });

    const updates = { ...req.body };

    if (req.file) {
      if (ej.archivo && ej.archivo.includes('cloudinary.com')) {
        try {
          const resourceType = getResourceTypeFromUrl(ej.archivo);
          const pid = extractPublicId(ej.archivo, resourceType);
          if (pid) await cloudinary.uploader.destroy(pid, { resource_type: resourceType });
        } catch (e) {
          console.warn('No se pudo borrar ejercicio anterior de Cloudinary:', e.message);
        }
      }
      const baseName = req.file.originalname
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-zA-Z0-9._-]/g, "_");
      const cloudResult = await uploadToCloudinary(req.file.buffer, {
        folder: "nebriacademy/ejercicios",
        resource_type: "auto",
        public_id: baseName,
      });
      updates.archivo = cloudResult.secure_url;
    }

    const updated = await ej.update(updates);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── DELETE ──────────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const ej = await Ejercicios.findByPk(req.params.id);
    if (!ej) return res.status(404).json({ error: "No encontrado" });

    if (ej.archivo && ej.archivo.includes('cloudinary.com')) {
      try {
        const resourceType = getResourceTypeFromUrl(ej.archivo);
        const pid = extractPublicId(ej.archivo, resourceType);
        if (pid) await cloudinary.uploader.destroy(pid, { resource_type: resourceType });
      } catch (e) {
        console.warn('No se pudo borrar ejercicio de Cloudinary:', e.message);
      }
    }

    // Si se proporciona una razón (borrado por admin), notificamos al autor (profesor)
    const { reason } = req.query;
    if (reason && ej.autor) {
      try {
        const prof = await Profesores.findByPk(ej.autor);
        if (prof && prof.usuarioId) {
          await Notificaciones.create({
            usuarioId: prof.usuarioId,
            tipoUsuario: "profesor",
            mensaje: `Tu ejercicio "${ej.nombre}" ha sido eliminado por un administrador. Razón: ${reason}`,
            fecha: new Date(),
          });
        }
      } catch (errNotif) {
        console.warn("Error enviando notificación de borrado (ejercicio):", errNotif.message);
      }
    }

    await ej.destroy();

    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
