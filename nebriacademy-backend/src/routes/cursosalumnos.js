const express = require("express");
const router = express.Router();
const CursosAlumnos = require("../models/CursosAlumnos.js");
const Cursos = require("../models/Cursos.js");

// Rutas de Obtención
router.get("/", async (req, res) => {
  try {
    const data = await CursosAlumnos.findAll();
    res.json({ "Numero de cursosAlumnos": data.length, CursosAlumnos: data });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/registro", async (req, res) => {
  try {
    const { cursoId, alumnoId } = req.query;
    const registro = await CursosAlumnos.findOne({
      where: { cursoId, alumnoId },
    });
    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const r = await CursosAlumnos.findByPk(req.params.id);
    r ? res.json(r) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// Rutas de Votación
router.post("/vote", async (req, res) => {
  try {
    const { cursoId, alumnoId, vote } = req.body;
    if (!cursoId || !alumnoId || typeof vote !== "boolean") {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    const [registro] = await CursosAlumnos.findOrCreate({
      where: { cursoId, alumnoId },
      defaults: {
        favorito: false,
        apuntado: false,
        valoracion: null,
        comentario: null,
      },
    });

    const actual = registro.valoracion;
    const intVote = vote ? 1 : -1;
    let delta = 0;
    let nuevoEstado = vote;

    if (actual === vote) {
      nuevoEstado = null;
      delta = -intVote;
    } else if (actual === null || actual === undefined) {
      delta = intVote;
    } else {
      delta = intVote * 2;
    }

    const curso = await Cursos.findByPk(cursoId);
    if (!curso) return res.status(404).json({ error: "Curso no encontrado" });

    await curso.increment("valoracion", { by: delta });

    await registro.update({ valoracion: nuevoEstado });

    res.json({
      registro: { ...registro.toJSON(), valoracion: nuevoEstado },
      curso: { id: curso.id, valoracion: (curso.valoracion || 0) + delta },
    });
  } catch (error) {
    console.error("Error voto curso:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Rutas de Favoritos
router.post("/toggle-fav", async (req, res) => {
  try {
    const { cursoId, alumnoId } = req.body;
    if (!cursoId || !alumnoId)
      return res.status(400).json({ error: "Faltan datos" });

    const [registro] = await CursosAlumnos.findOrCreate({
      where: { cursoId, alumnoId },
      defaults: { favorito: true },
    });

    if (!registro.isNewRecord)
      await registro.update({ favorito: !registro.favorito });

    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// Rutas de Inscripción
router.post("/toggle-apuntado", async (req, res) => {
  try {
    const { cursoId, alumnoId } = req.body;
    if (!cursoId || !alumnoId)
      return res.status(400).json({ error: "Faltan datos" });

    const [registro] = await CursosAlumnos.findOrCreate({
      where: { cursoId, alumnoId },
      defaults: { apuntado: true },
    });

    if (!registro.isNewRecord)
      await registro.update({ apuntado: !registro.apuntado });

    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// Rutas de Comentarios
router.post("/comment", async (req, res) => {
  try {
    const { cursoId, alumnoId, comentario } = req.body;
    if (!cursoId || !alumnoId)
      return res.status(400).json({ error: "Faltan datos" });

    const [registro] = await CursosAlumnos.findOrCreate({
      where: { cursoId, alumnoId },
      defaults: { comentario: comentario || null },
    });

    if (!registro.isNewRecord) {
      await registro.update({
        comentario: comentario ? String(comentario).slice(0, 500) : null,
      });
    }
    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// Rutas de Actualización
router.put("/:id", async (req, res) => {
  try {
    const registro = await CursosAlumnos.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ error: "No encontrado" });

    await registro.update(req.body);
    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// Rutas de Eliminación
router.delete("/:id", async (req, res) => {
  try {
    const r = await CursosAlumnos.destroy({ where: { id: req.params.id } });
    r
      ? res.json({ mensaje: "Eliminado" })
      : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
