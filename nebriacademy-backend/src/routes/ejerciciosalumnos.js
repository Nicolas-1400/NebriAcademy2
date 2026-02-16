const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const EjerciciosAlumnos = require("../models/EjerciciosAlumnos");
const Ejercicios = require("../models/Ejercicios");
const Alumnos = require("../models/Alumnos");

// --- Config Upload ---
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

// --- Rutas ---

// GET / - Listar
router.get("/", async (req, res) => {
  try {
    const all = await EjerciciosAlumnos.findAll();
    res.json({ "Numero de registros": all.length, registros: all });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /:id - Detalle
router.get("/:id", async (req, res) => {
  try {
    const r = await EjerciciosAlumnos.findByPk(req.params.id);
    r ? res.json(r) : res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST / - Entregar ejercicio
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    const { ejercicioId, profileId } = req.body;

    // Validación de integridad referencial
    const validEjercicio = await Ejercicios.findByPk(ejercicioId);

    // Aquí 'profileId' debe corresponder al ID de la tabla Alumnos
    // ya que la tabla relacionar 'EjerciciosAlumnos' usa 'alumnoId' que FK a Alumnos.
    const validAlumno = await Alumnos.findByPk(profileId);

    if (!validEjercicio || !validAlumno) {
      return res.status(400).json({ error: "Ejercicio o Alumno inválido" });
    }

    const nuevo = await EjerciciosAlumnos.create({
      ejercicioId,
      alumnoId: profileId, // Usamos el profileId comprobado
      archivo: req.file ? req.file.filename : null,
    });

    res.status(201).json({ id: nuevo.id, archivo: nuevo.archivo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// PUT /:id - Editar entrega
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

// DELETE /:id - Borrar registro y archivo
router.delete("/:id", async (req, res) => {
  try {
    const r = await EjerciciosAlumnos.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "No encontrado" });

    // Eliminar archivo físico
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
