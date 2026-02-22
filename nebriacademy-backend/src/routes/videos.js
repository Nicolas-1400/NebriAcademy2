// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Videos = require("../models/Videos.js");
const Profesores = require("../models/Profesores.js");

// ── CONFIGURACIÓN (multer) ──────────────────────────────────────────────────
// Carpeta donde se guardan localmente los archivos de vídeo subidos
const uploadDir = path.join(
  __dirname,
  "../../../nebriacademy-frontend/src/assets/Videos",
);

// Configuramos multer para guardar el archivo en uploadDir conservando el nombre original
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, path.basename(file.originalname)),
  }),
});

// ── GET ─────────────────────────────────────────────────────────────────────
// GET /videos — Devuelve todos los vídeos registrados
router.get("/", async (req, res) => {
  try {
    const all = await Videos.findAll();
    res.json({ "Numero de videos": all.length, Videos: all });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /videos/:id — Devuelve un vídeo concreto por su ID
router.get("/:id", async (req, res) => {
  try {
    const v = await Videos.findByPk(req.params.id);
    v ? res.json(v) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST ────────────────────────────────────────────────────────────────────
// POST /videos — Sube un nuevo vídeo. Solo los profesores pueden hacerlo.
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido" });
    const { nombre, curso, profileId, tipo } = req.body;

    if (!nombre || !curso || !profileId || !tipo)
      return res.status(400).json({ error: "Datos incompletos" });

    let profesorId = null;

    // Solo aceptamos subidas de vídeo si el usuario es un profesor válido
    if (tipo === "profesor") {
      const p = await Profesores.findByPk(profileId);
      if (p) profesorId = p.id;
    }

    if (!profesorId)
      return res
        .status(400)
        .json({ error: "Profesor no identificado o no autorizado" });

    // Creamos el registro del vídeo en BDD con el archivo ya guardado en disco
    const nuevo = await Videos.create({
      autor: profesorId,
      curso,
      nombre,
      archivo: req.file.filename,
      valoracion: 0,
    });

    res.status(201).json({ id: nuevo.id, archivo: nuevo.archivo });
  } catch (e) {
    console.error("Error creando video:", e);
    res.status(500).json({ error: "Error creando video" });
  }
});

// ── PUT ─────────────────────────────────────────────────────────────────────
// PUT /videos/:id — Actualiza los datos de un vídeo. Si se adjunta archivo nuevo, también se actualiza
router.put("/:id", upload.single("archivo"), async (req, res) => {
  try {
    const v = await Videos.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: "No encontrado" });

    const updates = { ...req.body };
    if (req.file) updates.archivo = req.file.filename;

    const updated = await v.update(updates);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── DELETE ──────────────────────────────────────────────────────────────────
// DELETE /videos/:id — Elimina el vídeo de la BDD y borra también el archivo físico del disco
router.delete("/:id", async (req, res) => {
  try {
    const v = await Videos.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: "No encontrado" });

    // Intentamos borrar el fichero del disco; si no existe, ignoramos el error
    if (v.archivo) {
      const p = path.join(uploadDir, v.archivo);
      fs.promises.unlink(p).catch(() => {});
    }

    await v.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
