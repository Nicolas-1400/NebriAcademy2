// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const PuntuacionesEjercicios = require("../models/PuntuacionesEjercicios.js");
const Alumnos = require("../models/Alumnos.js");
const Ejercicios = require("../models/Ejercicios.js");
const EjerciciosAlumnos = require("../models/EjerciciosAlumnos.js");
const Notificaciones = require("../models/Notificaciones.js");

// ── CONTROLADOR: puntuacionesEjercicios ──────────────────────────────────────
// Registro y notificación de puntuaciones sobre entregas de ejercicios

// Listar todas las puntuaciones de ejercicios
exports.listAll = async (req, res) => {
  try {
    const all = await PuntuacionesEjercicios.findAll();
    res.json({ "Numero de puntuacionesEjercicios": all.length, PuntuacionesEjercicios: all });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Obtener puntuación por id
exports.getById = async (req, res) => {
  try {
    const p = await PuntuacionesEjercicios.findByPk(req.params.id);
    p ? res.json(p) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Crear una nueva puntuación y notificar al alumno
exports.create = async (req, res) => {
  try {
    const created = await PuntuacionesEjercicios.create(req.body);
    try {
      if (req.body.alumnoId && req.body.ejercicioId) {
        const al = await Alumnos.findByPk(req.body.alumnoId);
        // ejercicioId en el body apunta a la entrega (EjerciciosAlumnos), no al ejercicio base
        const entrega = await EjerciciosAlumnos.findByPk(req.body.ejercicioId);
        if (al && entrega) {
          // Obtenemos el ejercicio base para mostrar su nombre en la notificación
          const ej = await Ejercicios.findByPk(entrega.ejercicioId);
          if (ej) {
            await Notificaciones.create({ usuarioId: al.usuarioId, tipoUsuario: "alumno", mensaje: `Se ha corregido tu respuesta del ejercicio ${ej.nombre}`, enlace: `/Home/Courses/${ej.curso}` });
          }
        }
      }
    } catch (errNoti) {
      console.error("Error notificaciones puntuacion POST:", errNoti);
    }
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Actualizar puntuación y notificar cambios al alumno
exports.update = async (req, res) => {
  try {
    const p = await PuntuacionesEjercicios.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: "No encontrado" });
    const updated = await p.update(req.body);
    try {
      if (p.alumnoId && p.ejercicioId) {
        const al = await Alumnos.findByPk(p.alumnoId);
        // ejercicioId en la puntuación apunta a la entrega (EjerciciosAlumnos)
        const entrega = await EjerciciosAlumnos.findByPk(p.ejercicioId);
        if (al && entrega) {
          // Obtenemos el ejercicio base para mostrar su nombre en la notificación
          const ej = await Ejercicios.findByPk(entrega.ejercicioId);
          if (ej) {
            await Notificaciones.create({ usuarioId: al.usuarioId, tipoUsuario: "alumno", mensaje: `Se ha actualizado la corrección de tu respuesta del ejercicio ${ej.nombre}`, enlace: `/Home/Courses/${ej.curso}` });
          }
        }
      }
    } catch (errNoti) {
      console.error("Error notificaciones puntuacion PUT:", errNoti);
    }
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Eliminar puntuación de ejercicio
exports.remove = async (req, res) => {
  try {
    const p = await PuntuacionesEjercicios.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: "No encontrado" });
    await p.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};
