// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const CursosAlumnos = require("../models/CursosAlumnos.js");
const Cursos = require("../models/Cursos.js");

// ── GET ─────────────────────────────────────────────────────────────────────
// GET /cursosalumnos — Devuelve todos los registros de la relación alumno-curso
router.get("/", async (req, res) => {
  try {
    const data = await CursosAlumnos.findAll();
    res.json({ "Numero de cursosAlumnos": data.length, CursosAlumnos: data });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /cursosalumnos/registro — Busca el registro concreto de un alumno en un curso
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

// GET /cursosalumnos/:id — Devuelve un registro concreto por su ID
router.get("/:id", async (req, res) => {
  try {
    const r = await CursosAlumnos.findByPk(req.params.id);
    r ? res.json(r) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST ────────────────────────────────────────────────────────────────────
// POST /cursosalumnos/vote — Gestiona el voto (upvote/downvote) de un alumno sobre un curso.
// Si el alumno vota lo mismo que ya tenía, se deshace el voto. Si cambia de voto, el cambio es doble.
router.post("/vote", async (req, res) => {
  try {
    const { cursoId, alumnoId, vote } = req.body;
    if (!cursoId || !alumnoId || typeof vote !== "boolean") {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    // Si no existe registro para este alumno y curso, lo creamos con valores por defecto
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
    let cambio = 0;
    let nuevoEstado = vote;

    // Calculamos cuánto cambia la valoración del curso según el estado anterior del voto
    if (actual === vote) {
      // El alumno vota igual que antes: se cancela el voto
      nuevoEstado = null;
      cambio = -intVote;
    } else if (actual === null || actual === undefined) {
      // No tenía voto previo: sumamos o restamos 1
      cambio = intVote;
    } else {
      // Tenía voto contrario: el cambio vale doble (ej: de -1 a +1 son 2 puntos)
      cambio = intVote * 2;
    }

    const curso = await Cursos.findByPk(cursoId);
    if (!curso) return res.status(404).json({ error: "Curso no encontrado" });

    // Actualizamos la valoración total del curso
    await curso.increment("valoracion", { by: cambio });

    // Guardamos el nuevo estado del voto del alumno
    await registro.update({ valoracion: nuevoEstado });

    res.json({
      registro: { ...registro.toJSON(), valoracion: nuevoEstado },
      curso: { id: curso.id, valoracion: (curso.valoracion || 0) + cambio },
    });
  } catch (error) {
    console.error("Error voto curso:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /cursosalumnos/toggle-fav — Añade o quita un curso de favoritos para el alumno
router.post("/toggle-fav", async (req, res) => {
  try {
    const { cursoId, alumnoId } = req.body;
    if (!cursoId || !alumnoId)
      return res.status(400).json({ error: "Faltan datos" });

    // Si no existe el registro aún, lo creamos directamente con favorito: true
    const [registro, created] = await CursosAlumnos.findOrCreate({
      where: { cursoId, alumnoId },
      defaults: { favorito: true },
    });

    // Si ya existía, invertimos el estado actual del favorito
    if (!created)
      await registro.update({ favorito: !registro.favorito });

    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /cursosalumnos/toggle-apuntado — Inscribe o desinscribe a un alumno en un curso
router.post("/toggle-apuntado", async (req, res) => {
  try {
    const { cursoId, alumnoId } = req.body;
    if (!cursoId || !alumnoId)
      return res.status(400).json({ error: "Faltan datos" });

    // Si no existe el registro aún, lo creamos directamente con apuntado: true
    const [registro, created] = await CursosAlumnos.findOrCreate({
      where: { cursoId, alumnoId },
      defaults: { apuntado: true },
    });

    // Si ya existía, invertimos el estado de inscripción
    if (!created)
      await registro.update({ apuntado: !registro.apuntado });

    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /cursosalumnos/comment — Guarda o actualiza el comentario de un alumno en un curso
router.post("/comment", async (req, res) => {
  try {
    const { cursoId, alumnoId, comentario } = req.body;
    if (!cursoId || !alumnoId)
      return res.status(400).json({ error: "Faltan datos" });

    const [registro, created] = await CursosAlumnos.findOrCreate({
      where: { cursoId, alumnoId },
      defaults: { comentario: comentario || null },
    });

    if (!created) {
      // Limitamos el comentario a 500 caracteres para evitar entradas demasiado largas
      await registro.update({
        comentario: comentario ? String(comentario).slice(0, 500) : null,
      });
    }
    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── PUT ─────────────────────────────────────────────────────────────────────
// PUT /cursosalumnos/:id — Actualiza un registro concreto con los campos que vengan en el body
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

// ── DELETE ──────────────────────────────────────────────────────────────────
// DELETE /cursosalumnos/:id — Elimina el registro de la relación alumno-curso
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

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
