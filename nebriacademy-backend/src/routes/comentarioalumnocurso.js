// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const ComentarioAlumnoCurso = require("../models/ComentatioAlumnoCurso.js");
const Alumnos = require("../models/Alumnos.js");

// ── GET ─────────────────────────────────────────────────────────────────────
// GET /comentarioalumnocurso — Devuelve todos los comentarios, opcionalmente filtrados por cursoId.
// Para cada comentario, busca al autor (alumno) y añade su nombre y apellidos a la respuesta.
router.get("/", async (req, res) => {
  try {
    const { cursoId } = req.query;

    const filtro = cursoId ? { where: { cursoId } } : {};
    const comentarios = await ComentarioAlumnoCurso.findAll(filtro);

    // Para cada comentario, buscamos en alumnos
    const enhanced = await Promise.all(
      comentarios.map(async (c) => {
        let nombre = "Usuario",
          apellidos = "";

        let autor = await Alumnos.findOne({
          where: { usuarioId: c.usuarioId },
        });

        if (autor) {
          nombre = autor.nombre;
          apellidos = autor.apellidos;
        }

        // Devolvemos el comentario con el nombre del autor
        return {
          id: c.id,
          usuarioId: c.usuarioId,
          cursoId: c.cursoId,
          comentario: c.comentario,
          nombre,
          apellidos,
        };
      }),
    );

    res.json({
      "Numero de comentarios": enhanced.length,
      Comentarios: enhanced,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// GET /comentarioalumnocurso/:id — Devuelve un comentario concreto por su ID
router.get("/:id", async (req, res) => {
  try {
    const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
    c ? res.json(c) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Error servidor" });
  }
});

// ── POST ────────────────────────────────────────────────────────────────────
// POST /comentarioalumnocurso — Crea un nuevo comentario en un curso.
router.post("/", async (req, res) => {
  try {
    const { profileId, tipo, cursoId, comentario } = req.body;
    if (!profileId || !tipo || !cursoId || !comentario)
      return res.status(400).json({ error: "Faltan datos" });

    let usuarioId = null;

    // Buscamos al usuario para obtener su usuarioId
    if (tipo === "alumno") {
      const u = await Alumnos.findByPk(profileId);
      if (u) usuarioId = u.usuarioId;
    }

    if (!usuarioId)
      return res.status(404).json({ error: "Usuario no encontrado" });

    // Guardamos el comentario en la BDD vinculado al usuario y al curso
    const nuevo = await ComentarioAlumnoCurso.create({
      usuarioId,
      cursoId,
      comentario,
    });
    res.status(201).json(nuevo);
  } catch (e) {
    console.error("Error creando comentario:", e);
    res.status(500).json({ error: "Error servidor" });
  }
});

// ── PUT ─────────────────────────────────────────────────────────────────────
// PUT /comentarioalumnocurso/:id — Edita un comentario existente.
// Solo puede editarlo el mismo usuario que lo creó (se verifica comparando el usuarioId).
router.put("/:id", async (req, res) => {
  try {
    const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "No encontrado" });

    const { profileId, tipo, comentario } = req.body;

    let requesterUsuarioId = null;

    // Obtenemos el usuarioId del que hace la petición para comprobarlo con el del comentario
    if (tipo === "alumno") {
      const u = await Alumnos.findByPk(profileId);
      if (u) requesterUsuarioId = u.usuarioId;
    }

    // Si el usuarioId no coincide con el del comentario, devolvemos 403 (prohibido)
    if (!requesterUsuarioId || requesterUsuarioId !== c.usuarioId) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const actualizado = await c.update({
      comentario: comentario || c.comentario,
    });
    res.json(actualizado);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error servidor" });
  }
});

// ── DELETE ──────────────────────────────────────────────────────────────────
// DELETE /comentarioalumnocurso/:id — Elimina un comentario.
// Solo puede borrarlo el mismo usuario que lo creó (misma comprobación de usuarioId).
router.delete("/:id", async (req, res) => {
  try {
    const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "No encontrado" });

    const { profileId, tipo } = req.query;

    let requesterUsuarioId = null;
    if (tipo === "alumno") {
      const u = await Alumnos.findByPk(profileId);
      if (u) requesterUsuarioId = u.usuarioId;
    }
    // Si el usuarioId no coincide con el del comentario, devolvemos 403 (prohibido)
    if (!requesterUsuarioId || requesterUsuarioId !== c.usuarioId) {
      return res.status(403).json({ error: "No autorizado" });
    }

    await c.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error servidor" });
  }
});

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
