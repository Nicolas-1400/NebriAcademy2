const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const EjerciciosAlumnos = require("../models/EjerciciosAlumnos");
const Ejercicios = require("../models/Ejercicios");
const Alumnos = require("../models/Alumnos");

// Configuración de Subida de Archivos
const uploadDir = path.join(
  __dirname,
  "../../../nebriacademy-frontend/src/assets/EjerciciosAlumnos",
);
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, path.basename(file.originalname)),
  }),
});

// Rutas de Obtención
router.get("/", async (req, res) => {
  try {
    const all = await EjerciciosAlumnos.findAll();
    res.json({ "Numero de registros": all.length, registros: all });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const r = await EjerciciosAlumnos.findByPk(req.params.id);
    r ? res.json(r) : res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Rutas de Entrega de Ejercicios
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    const { ejercicioId, profileId } = req.body;

    const validEjercicio = await Ejercicios.findByPk(ejercicioId);
    const validAlumno = await Alumnos.findByPk(profileId);

    if (!validEjercicio || !validAlumno) {
      return res.status(400).json({ error: "Ejercicio o Alumno inválido" });
    }

    const nuevo = await EjerciciosAlumnos.create({
      ejercicioId,
      alumnoId: profileId,
      archivo: req.file ? req.file.filename : null,
    });

    res.status(201).json({ id: nuevo.id, archivo: nuevo.archivo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Rutas de Actualización
router.put("/:id", upload.single("archivo"), async (req, res) => {
  try {
    const r = await EjerciciosAlumnos.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "No encontrado" });

    const updates = { ...req.body };
    if (req.file) updates.archivo = req.file.filename;

    const updated = await r.update(updates);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Rutas de Eliminación
router.delete("/:id", async (req, res) => {
  try {
    const r = await EjerciciosAlumnos.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "No encontrado" });

    if (r.archivo) {
      const p = path.join(uploadDir, r.archivo);
      fs.promises.unlink(p).catch(() => {});
    }

    await r.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
