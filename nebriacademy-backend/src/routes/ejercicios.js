// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Ejercicios = require("../models/Ejercicios.js");
const Profesores = require("../models/Profesores.js");

// ── CONFIGURACIÓN (multer) ──────────────────────────────────────────────────
// Carpeta donde se guardan físicamente los archivos de ejercicios subidos
const uploadDir = path.join(
  __dirname,
  "../../../nebriacademy-frontend/src/assets/Ejercicios",
);

// Configuramos multer para guardar el archivo en uploadDir conservando el nombre original
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, path.basename(file.originalname)),
  }),
});

// ── GET ─────────────────────────────────────────────────────────────────────
// GET /ejercicios — Devuelve todos los ejercicios registrados
router.get("/", async (req, res) => {
  try {
    const all = await Ejercicios.findAll();
    res.json({ "Numero de ejercicios": all.length, Ejercicios: all });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /ejercicios/:id — Devuelve un ejercicio concreto por su ID
router.get("/:id", async (req, res) => {
  try {
    const ej = await Ejercicios.findByPk(req.params.id);
    ej ? res.json(ej) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST ────────────────────────────────────────────────────────────────────
// POST /ejercicios — Sube un nuevo ejercicio. Solo los profesores pueden crearlo.
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido" });
    const { nombre, descripcion, curso, profileId, tipo } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });
    if (!profileId || !tipo)
      return res.status(400).json({ error: "Faltan datos de autor" });

    let profesorId = null;

    // Solo aceptamos si el usuario es un profesor válido
    if (tipo === "profesor") {
      const prof = await Profesores.findByPk(profileId);
      if (prof) profesorId = prof.id;
    }

    if (!profesorId)
      return res
        .status(400)
        .json({ error: "Profesor no identificado o no autorizado" });

    // Creamos el registro del ejercicio en BDD con el archivo ya guardado localmente
    const nuevo = await Ejercicios.create({
      autor: profesorId,
      curso: curso || null,
      descripcion: descripcion || null,
      archivo: req.file.filename,
      nombre,
    });

    res.status(201).json({ id: nuevo.id, archivo: nuevo.archivo });
  } catch (error) {
    console.error("Error creando ejercicio:", error);
    res.status(500).json({ error: "Error creando ejercicio" });
  }
});

// ── PUT ─────────────────────────────────────────────────────────────────────
// PUT /ejercicios/:id — Actualiza los datos de un ejercicio. Si llega un archivo nuevo, también se actualiza
router.put("/:id", upload.single("archivo"), async (req, res) => {
  try {
    const ej = await Ejercicios.findByPk(req.params.id);
    if (!ej) return res.status(404).json({ error: "No encontrado" });

    const updates = { ...req.body };
    if (req.file) updates.archivo = req.file.filename;

    const updated = await ej.update(updates);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── DELETE ──────────────────────────────────────────────────────────────────
// DELETE /ejercicios/:id — Elimina el ejercicio de la BDD y borra también el archivo local
router.delete("/:id", async (req, res) => {
  try {
    const ej = await Ejercicios.findByPk(req.params.id);
    if (!ej) return res.status(404).json({ error: "No encontrado" });

    // Intentamos borrar el fichero local; si no existe, ignoramos el error
    if (ej.archivo) {
      const p = path.join(uploadDir, ej.archivo);
      fs.promises.unlink(p).catch(() => {});
    }

    await ej.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
