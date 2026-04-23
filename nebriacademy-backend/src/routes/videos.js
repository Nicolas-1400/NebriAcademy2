// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");

const cloudinary = require("./cloudinary");
const Videos = require("../models/Videos.js");
const Profesores = require("../models/Profesores.js");
const Alumnos = require("../models/Alumnos.js");
const Cursos = require("../models/Cursos.js");
const CursosAlumnos = require("../models/CursosAlumnos.js");
const Notificaciones = require("../models/Notificaciones.js");

// ── CONFIGURACIÓN (multer) ──────────────────────────────────────────────────
// Usamos memoryStorage: el archivo queda en RAM y lo subimos directamente a Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

// ── HELPER ──────────────────────────────────────────────────────────────────
function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Extrae el public_id de Cloudinary de una secure_url para poder borrar el asset
function extractPublicId(url, resourceType) {
  try {
    const parts = url.split("/");
    const uploadIdx = parts.indexOf("upload");
    // Saltamos "upload" y la versión (v12345...)
    const afterUpload = parts.slice(uploadIdx + 2);
    const publicIdWithExt = afterUpload.join("/");
    // Para raw, Cloudinary necesita la extensión; para video, no
    return resourceType === "raw" ? publicIdWithExt : publicIdWithExt.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}

// ── GET ─────────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const all = await Videos.findAll();
    res.json({ "Numero de videos": all.length, Videos: all });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const v = await Videos.findByPk(req.params.id);
    v ? res.json(v) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST ────────────────────────────────────────────────────────────────────
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido" });
    const { nombre, curso, profileId, tipo } = req.body;

    if (!nombre || !curso || !profileId || !tipo)
      return res.status(400).json({ error: "Datos incompletos" });

    let profesorId = null;
    if (tipo === "profesor") {
      const p = await Profesores.findByPk(profileId);
      if (p) profesorId = p.id;
    }

    if (!profesorId)
      return res.status(400).json({ error: "Profesor no identificado o no autorizado" });

    const cloudResult = await uploadToCloudinary(req.file.buffer, {
      folder: "nebriacademy/videos",
      resource_type: "video",
      public_id: `video_${Date.now()}_${req.file.originalname.replace(/\s+/g, "_")}`,
    });

    const nuevo = await Videos.create({
      autor: profesorId,
      curso,
      nombre,
      archivo: cloudResult.secure_url,
      valoracion: 0,
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
              mensaje: `Nuevo vídeo subido en el curso ${c ? c.nombreCurso : 'seleccionado'}`,
              enlace: `/Home/Cursos/${curso}`
            });
          }
        }
        if (notificaciones.length > 0) await Notificaciones.bulkCreate(notificaciones);
      }
    } catch (errNoti) {
      console.error("Error creando notificaciones (videos):", errNoti);
    }

    res.status(201).json({ id: nuevo.id, archivo: nuevo.archivo });
  } catch (e) {
    console.error("Error creando video:", e);
    res.status(500).json({ error: "Error creando video" });
  }
});

// ── PUT ─────────────────────────────────────────────────────────────────────
router.put("/:id", upload.single("archivo"), async (req, res) => {
  try {
    const v = await Videos.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: "No encontrado" });

    const updates = { ...req.body };

    if (req.file) {
      if (v.archivo && v.archivo.includes("cloudinary.com")) {
        try {
          const pid = extractPublicId(v.archivo, "video");
          if (pid) await cloudinary.uploader.destroy(pid, { resource_type: "video" });
        } catch (e) {
          console.warn("No se pudo borrar video anterior de Cloudinary:", e.message);
        }
      }
      const cloudResult = await uploadToCloudinary(req.file.buffer, {
        folder: "nebriacademy/videos",
        resource_type: "video",
        public_id: `video_${Date.now()}_${req.file.originalname.replace(/\s+/g, "_")}`,
      });
      updates.archivo = cloudResult.secure_url;
    }

    const updated = await v.update(updates);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── DELETE ──────────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const v = await Videos.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: "No encontrado" });

    if (v.archivo && v.archivo.includes("cloudinary.com")) {
      try {
        const pid = extractPublicId(v.archivo, "video");
        if (pid) await cloudinary.uploader.destroy(pid, { resource_type: "video" });
      } catch (e) {
        console.warn("No se pudo borrar video de Cloudinary:", e.message);
      }
    }

    await v.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
