const express = require("express");
const router = express.Router();
const ComentarioAlumnoCurso = require("../models/ComentatioAlumnoCurso.js");
const Alumnos = require("../models/Alumnos.js");
const Profesores = require("../models/Profesores.js");

// Obtener todos los comentarios (opcionalmente filtrar por cursoId)
router.get("/", (req, res) => {
  try {
    console.log("GET /comentarioalumnocurso");
    const { cursoId } = req.query;
    ComentarioAlumnoCurso.findAll().then(async (resultado) => {
      let list = resultado;
      if (cursoId) {
        list = list.filter((c) => String(c.cursoId) === String(cursoId));
      }

      // Añadir nombre y apellidos si es posible
      const enhanced = await Promise.all(
        list.map(async (c) => {
          let nombre = null;
          let apellidos = null;
            try {
            const alumno = await Alumnos.findOne({ where: { id: c.usuarioId } });
            if (alumno) {
              nombre = alumno.nombre;
              apellidos = alumno.apellidos;
            } else {
              const prof = await Profesores.findOne({ where: { id: c.usuarioId } });
              if (prof) {
                nombre = prof.nombre;
                apellidos = prof.apellidos;
              }
            }
          } catch (e) {
            console.error('Error buscando nombre de usuario:', e);
          }
          return { id: c.id, usuarioId: c.usuarioId, cursoId: c.cursoId, comentario: c.comentario, nombre, apellidos };
        })
      );

      res.json({ "Numero de comentarios": enhanced.length, Comentarios: enhanced });
    });
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener un comentario por ID
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`GET /comentarioalumnocurso/${id}`);
    ComentarioAlumnoCurso.findAll().then((resultado) => {
      const comentario = resultado.find((c) => c.id === id);
      if (comentario) {
        res.json(comentario);
      } else {
        res.status(404).json({ error: "Comentario no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al obtener comentario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear un comentario
router.post("/", async (req, res) => {
  try {
    const usuarioId = req.body.usuarioId ? parseInt(req.body.usuarioId) : null;
    const cursoId = req.body.cursoId ? parseInt(req.body.cursoId) : null;
    const comentario = req.body.comentario || null;

    if (!usuarioId || !cursoId || !comentario) {
      return res.status(400).json({ error: "Campos 'usuarioId', 'cursoId' y 'comentario' son requeridos" });
    }

    const nuevo = await ComentarioAlumnoCurso.create({ usuarioId, cursoId, comentario });
    return res.status(201).json({ id: nuevo.id, usuarioId, cursoId, comentario });
  } catch (error) {
    console.error("Error al crear comentario:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar un comentario por ID (solo autor)
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`PUT /comentarioalumnocurso/${id}`);
    ComentarioAlumnoCurso.findAll().then((resultado) => {
      const comentario = resultado.find((c) => c.id === id);
      if (comentario) {
        // autorización: solo el autor puede modificar
        const requester = req.body.usuarioId ? parseInt(req.body.usuarioId) : null;
        if (!requester || requester !== comentario.usuarioId) {
          return res.status(403).json({ error: 'No autorizado para editar este comentario' });
        }
        const nuevoTexto = req.body.comentario || comentario.comentario;
        comentario.update({ comentario: String(nuevoTexto).slice(0, 500) }).then((actualizado) => res.json(actualizado));
      } else {
        res.status(404).json({ error: "Comentario no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al actualizar comentario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un comentario por ID (solo autor). Pasar ?usuarioId=xxx
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /comentarioalumnocurso/${id}`);
    const requester = req.query.usuarioId ? parseInt(req.query.usuarioId) : null;
    ComentarioAlumnoCurso.findAll().then((resultado) => {
      const comentario = resultado.find((c) => c.id === id);
      if (comentario) {
        if (!requester || requester !== comentario.usuarioId) {
          return res.status(403).json({ error: 'No autorizado para eliminar este comentario' });
        }
        comentario.destroy().then(() => res.json({ mensaje: "Comentario eliminado" }));
      } else {
        res.status(404).json({ error: "Comentario no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
