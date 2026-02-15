const express = require("express");
const router = express.Router();
const CursosAlumnos = require("../models/CursosAlumnos.js");
const Cursos = require("../models/Cursos.js");

// GET / - Listar todos
router.get("/", async (req, res) => {
  try {
    const data = await CursosAlumnos.findAll();
    res.json({ "Numero de cursosAlumnos": data.length, CursosAlumnos: data });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /registro - Buscar por cursoId y alumnoId
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

// GET /:id - Detalle
router.get("/:id", async (req, res) => {
  try {
    const r = await CursosAlumnos.findByPk(req.params.id);
    r ? res.json(r) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /vote - Votar curso (Toggle Upvote/Downvote logic)
router.post("/vote", async (req, res) => {
  try {
    const { cursoId, alumnoId, vote } = req.body;
    if (!cursoId || !alumnoId || typeof vote !== "boolean") {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    // 1. Obtener registro
    const [registro] = await CursosAlumnos.findOrCreate({
      where: { cursoId, alumnoId },
      defaults: {
        favorito: false,
        apuntado: false,
        valoracion: null,
        comentario: null,
      },
    });

    // 2. Lógica de votación ("Toggle")
    // Permite al usuario votar positivo (true) o negativo (false).
    // Si vota lo mismo que ya tenía, se elimina el voto (estado null).
    // Si cambia de opinión, actualiza el valor.
    const actual = registro.valoracion;
    const intVote = vote ? 1 : -1;
    let delta = 0;
    let nuevoEstado = vote;

    if (actual === vote) {
      // Quitar voto (toggle off)
      nuevoEstado = null;
      delta = -intVote;
    } else if (actual === null || actual === undefined) {
      // Nuevo voto
      delta = intVote;
    } else {
      // Cambiar sentido (up->down o down->up)
      delta = intVote * 2;
    }

    // 3. Actualizar Curso
    const curso = await Cursos.findByPk(cursoId);
    if (!curso) return res.status(404).json({ error: "Curso no encontrado" });

    await curso.increment("valoracion", { by: delta });

    // 4. Actualizar Registro
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

// POST /toggle-fav
router.post("/toggle-fav", async (req, res) => {
  try {
    const { cursoId, alumnoId } = req.body;
    if (!cursoId || !alumnoId)
      return res.status(400).json({ error: "Faltan datos" });

    const [registro] = await CursosAlumnos.findOrCreate({
      where: { cursoId, alumnoId },
      defaults: { favorito: true },
    });

    // Si ya existía, invertir
    if (!registro.isNewRecord)
      await registro.update({ favorito: !registro.favorito });

    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /toggle-apuntado
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

// POST /comment
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

// PUT /:id - Actualizar admin
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

// DELETE /:id
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
