const express = require("express");
const router = express.Router();
const ComentarioAlumnoCurso = require("../models/ComentatioAlumnoCurso.js");
const Alumnos = require("../models/Alumnos.js");
const Profesores = require("../models/Profesores.js");

// Rutas de Obtención
router.get("/", async (req, res) => {
  try {
    const { cursoId } = req.query;

    const filtro = cursoId ? { where: { cursoId } } : {};
    const comentarios = await ComentarioAlumnoCurso.findAll(filtro);

    const enhanced = await Promise.all(
      comentarios.map(async (c) => {
        let nombre = "Usuario",
          apellidos = "";

        let autor = await Alumnos.findOne({
          where: { usuarioId: c.usuarioId },
        });

        if (!autor) {
          autor = await Profesores.findOne({
            where: { usuarioId: c.usuarioId },
          });
        }

        if (autor) {
          nombre = autor.nombre;
          apellidos = autor.apellidos;
        }

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

router.get("/:id", async (req, res) => {
  try {
    const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
    c ? res.json(c) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Error servidor" });
  }
});

// Rutas de Creación
router.post("/", async (req, res) => {
  try {
    const { profileId, tipo, cursoId, comentario } = req.body;
    if (!profileId || !tipo || !cursoId || !comentario)
      return res.status(400).json({ error: "Faltan datos" });

    let usuarioId = null;
    if (tipo === "alumno") {
      const u = await Alumnos.findByPk(profileId);
      if (u) usuarioId = u.usuarioId;
    } else if (tipo === "profesor") {
      const u = await Profesores.findByPk(profileId);
      if (u) usuarioId = u.usuarioId;
    } else if (tipo === "administrador") {
      const u = await require("../models/Administradores").findByPk(profileId);
      if (u) usuarioId = u.usuarioId;
    }

    if (!usuarioId)
      return res.status(404).json({ error: "Usuario no encontrado" });

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

// Rutas de Actualización
router.put("/:id", async (req, res) => {
  try {
    const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "No encontrado" });

    const { profileId, tipo, comentario } = req.body;

    let requesterUsuarioId = null;
    if (tipo === "alumno") {
      const u = await Alumnos.findByPk(profileId);
      if (u) requesterUsuarioId = u.usuarioId;
    } else if (tipo === "profesor") {
      const u = await Profesores.findByPk(profileId);
      if (u) requesterUsuarioId = u.usuarioId;
    }

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

// Rutas de Eliminación
router.delete("/:id", async (req, res) => {
  try {
    const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "No encontrado" });

    const { profileId, tipo } = req.query;

    let requesterUsuarioId = null;
    if (tipo === "alumno") {
      const u = await Alumnos.findByPk(profileId);
      if (u) requesterUsuarioId = u.usuarioId;
    } else if (tipo === "profesor") {
      const u = await Profesores.findByPk(profileId);
      if (u) requesterUsuarioId = u.usuarioId;
    }

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

module.exports = router;
