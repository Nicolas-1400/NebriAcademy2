const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Videos = require("../models/Videos.js");
const Profesores = require("../models/Profesores.js");

// --- Config Upload ---
const uploadDir = path.join(
  __dirname,
  "../../../nebriacademy-frontend/src/assets/Videos",
);
// --- Config Upload (Multer) ---
// Middleware 'multer' para gestionar la recepción de archivos multipart/form-data.
// Los archivos se guardan en una carpeta local accesible por el frontend.
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, path.basename(file.originalname)), // Mantiene el nombre original del archivo
  }),
});

// GET / - Listar
router.get("/", async (req, res) => {
  try {
    const all = await Videos.findAll();
    res.json({ "Numero de videos": all.length, Videos: all });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /:id - Detalle
router.get("/:id", async (req, res) => {
  try {
    const v = await Videos.findByPk(req.params.id);
    v ? res.json(v) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /
 * Crea video, sube archivo y asigna profesor.
 * Resolución de autor: Recibe profileId y tipo, busca el profesor correspondiente.
 */
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    // 1. Validaciones
    if (!req.file) return res.status(400).json({ error: "Archivo requerido" });
    const { nombre, curso, profileId, tipo } = req.body;

    if (!nombre || !curso || !profileId || !tipo)
      return res.status(400).json({ error: "Datos incompletos" });

    // 2. Resolver Profesor ID
    let profesorId = null;

    if (tipo === "profesor") {
      // En la tabla Videos, 'autor' suele ser el ID del profesor (profileId),
      // NO el usuarioId. Verificamos que exista.
      const p = await Profesores.findByPk(profileId);
      if (p) profesorId = p.id;
    } else if (tipo === "administrador") {
      // Los admins pueden subir videos, pero la tabla Videos espera un ID de profesor en 'autor'?
      // Si el esquema lo requiere, esto podría fallar si no hay un "profesor comodín".
      // Asumiremos por ahora que solo profesores suben videos a sus cursos,
      // o que el admin actúa como tal.
      // Si el admin tiene perfil de profesor, lo usamos.
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

    // 3. Crear
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

// PUT /:id - Actualizar
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

// DELETE /:id - Borrar
router.delete("/:id", async (req, res) => {
  try {
    const v = await Videos.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: "No encontrado" });

    // Borrar archivo físico
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

module.exports = router;
