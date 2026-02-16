const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Ejercicios = require("../models/Ejercicios.js");
const Profesores = require("../models/Profesores.js");

// --- Configuración Upload ---
const uploadDir = path.join(
  __dirname,
  "../../../nebriacademy-frontend/src/assets/Ejercicios",
);
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, path.basename(file.originalname)),
  }),
});

// --- Rutas ---

// GET / - Listar
router.get("/", async (req, res) => {
  try {
    const all = await Ejercicios.findAll();
    res.json({ "Numero de ejercicios": all.length, Ejercicios: all });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /:id - Detalle
router.get("/:id", async (req, res) => {
  try {
    const ej = await Ejercicios.findByPk(req.params.id);
    ej ? res.json(ej) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /
 * Crea ejercicio, sube archivo y asigna profesor (autor).
 * Resolución de autor: Recibe profileId y tipo, busca el profesor correspondiente.
 */
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    // 1. Validaciones básicas
    if (!req.file) return res.status(400).json({ error: "Archivo requerido" });
    const { nombre, descripcion, curso, profileId, tipo } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });
    if (!profileId || !tipo)
      return res.status(400).json({ error: "Faltan datos de autor" });

    // 2. Resolver Profesor ID
    // La tabla Ejercicios usa 'autor' como ID de Profesor (no User ID)
    let profesorId = null;

    if (tipo === "profesor") {
      const prof = await Profesores.findByPk(profileId);
      if (prof) profesorId = prof.id;
    } else if (tipo === "administrador") {
      const admin = await require("../models/Administradores").findByPk(
        profileId,
      );
      if (admin && admin.usuarioId) {
        const p = await Profesores.findOne({
          where: { usuarioId: admin.usuarioId },
        });
        if (p) profesorId = p.id;
      }
    }

    if (!profesorId)
      return res
        .status(400)
        .json({ error: "Profesor no identificado o no autorizado" });

    // 3. Crear Registro
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

// PUT /:id - Actualizar
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

// DELETE /:id - Borrar
router.delete("/:id", async (req, res) => {
  try {
    const ej = await Ejercicios.findByPk(req.params.id);
    if (!ej) return res.status(404).json({ error: "No encontrado" });

    // Borrar archivo físico
    if (ej.archivo) {
      const p = path.join(uploadDir, ej.archivo);
      fs.promises.unlink(p).catch(() => {}); // Ignorar error si no existe
    }

    await ej.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
