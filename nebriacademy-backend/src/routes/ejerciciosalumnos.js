// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const EjerciciosAlumnos = require("../models/EjerciciosAlumnos");
const Ejercicios = require("../models/Ejercicios");
const Alumnos = require("../models/Alumnos");
const Profesores = require("../models/Profesores");
const ProfesoresCursos = require("../models/ProfesoresCursos");
const Notificaciones = require("../models/Notificaciones");

// ── CONFIGURACIÓN (multer) ──────────────────────────────────────────────────
// Carpeta donde se guardan localmente las entregas de ejercicios que suben los alumnos
const uploadDir = path.join(
  __dirname,
  "../../../nebriacademy-frontend/src/assets/EjerciciosAlumnos",
);

// Configuramos multer para guardar el archivo en uploadDir conservando el nombre original
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, path.basename(file.originalname)),
  }),
});

// ── GET ─────────────────────────────────────────────────────────────────────
// GET /ejerciciosalumnos — Devuelve todos los registros de entregas de alumnos
router.get("/", async (req, res) => {
  try {
    const all = await EjerciciosAlumnos.findAll();
    res.json({ "Numero de registros": all.length, registros: all });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /ejerciciosalumnos/:id — Devuelve una entrega concreta por su ID
router.get("/:id", async (req, res) => {
  try {
    const r = await EjerciciosAlumnos.findByPk(req.params.id);
    r ? res.json(r) : res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST ────────────────────────────────────────────────────────────────────
// POST /ejerciciosalumnos — Registra la entrega de un alumno para un ejercicio concreto
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    const { ejercicioId, profileId } = req.body;

    // Verificamos que tanto el ejercicio como el alumno existen en la BDD antes de crear el registro
    const validEjercicio = await Ejercicios.findByPk(ejercicioId);
    const validAlumno = await Alumnos.findByPk(profileId);

    if (!validEjercicio || !validAlumno) {
      return res.status(400).json({ error: "Ejercicio o Alumno inválido" });
    }

    // Creamos el registro de la entrega, asociando el alumno al ejercicio con el archivo subido
    const nuevo = await EjerciciosAlumnos.create({
      ejercicioId,
      alumnoId: profileId,
      archivo: req.file ? req.file.filename : null,
    });

    // --- NOTIFICACIONES ---
    try {
      if (validEjercicio.curso) {
        const arrProfesores = await ProfesoresCursos.findAll({ where: { cursoId: validEjercicio.curso } });
        const notificaciones = [];
        for (const pc of arrProfesores) {
          const p = await Profesores.findByPk(pc.profesorId);
          if (p) {
            notificaciones.push({
              usuarioId: p.usuarioId,
              tipoUsuario: "profesor",
              mensaje: `El alumno ${validAlumno.nombre} ha subido una respuesta al ejercicio ${validEjercicio.nombre}`,
              enlace: `/Home/CorregirEjerciciosSubidos/${ejercicioId}` // Suponiendo esta es la navegacion
            });
          }
        }
        if (notificaciones.length > 0) await Notificaciones.bulkCreate(notificaciones);
      }
    } catch (errNoti) {
      console.error("Error creando notificaciones (ejerciciosalumnos):", errNoti);
    }

    res.status(201).json({ id: nuevo.id, archivo: nuevo.archivo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// ── PUT ─────────────────────────────────────────────────────────────────────
// PUT /ejerciciosalumnos/:id — Actualiza una entrega. Si llega un archivo nuevo, también se actualiza
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

// ── DELETE ──────────────────────────────────────────────────────────────────
// DELETE /ejerciciosalumnos/:id — Elimina la entrega de la BDD y borra también el archivo local del disco
router.delete("/:id", async (req, res) => {
  try {
    const r = await EjerciciosAlumnos.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "No encontrado" });

    // Intentamos borrar el fichero local; si no existe, ignoramos el error
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

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
