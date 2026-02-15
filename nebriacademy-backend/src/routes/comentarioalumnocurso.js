const express = require("express");
const router = express.Router();
const ComentarioAlumnoCurso = require("../models/ComentatioAlumnoCurso.js");
const Alumnos = require("../models/Alumnos.js");
const Profesores = require("../models/Profesores.js");

// GET / - Listar comentarios (filtrando por cursoId opcional)
// Mejora: Obtiene los nombres de los autores eficientemente
router.get("/", async (req, res) => {
  try {
    const { cursoId } = req.query;

    // Obtener comentarios (filtrados si hay cursoId)
    const filtro = cursoId ? { where: { cursoId } } : {};
    const comentarios = await ComentarioAlumnoCurso.findAll(filtro);

    // Enriquecer con nombre de autores
    const enhanced = await Promise.all(
      comentarios.map(async (c) => {
        let nombre = "Usuario",
          apellidos = "";

        // Buscar en Alumnos
        let autor = await Alumnos.findOne({
          where: { usuarioId: c.usuarioId },
        });

        // Si no es alumno, buscar en Profesores
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

// GET /:id - Obtener uno
router.get("/:id", async (req, res) => {
  try {
    const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
    c ? res.json(c) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Error servidor" });
  }
});

// POST / - Crear
router.post("/", async (req, res) => {
  try {
    const { usuarioId, cursoId, comentario } = req.body;
    if (!usuarioId || !cursoId || !comentario)
      return res.status(400).json({ error: "Faltan datos" });

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

// PUT /:id - Editar (solo autor)
router.put("/:id", async (req, res) => {
  try {
    const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "No encontrado" });

    // Validar autoría
    const requester = req.body.usuarioId;
    if (requester && parseInt(requester) !== c.usuarioId) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const actualizado = await c.update({
      comentario: req.body.comentario || c.comentario,
    });
    res.json(actualizado);
  } catch (e) {
    res.status(500).json({ error: "Error servidor" });
  }
});

// DELETE /:id - Borrar (solo autor)
router.delete("/:id", async (req, res) => {
  try {
    const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "No encontrado" });

    // Validar autoría
    const requester = req.query.usuarioId;
    if (requester && parseInt(requester) !== c.usuarioId) {
      return res.status(403).json({ error: "No autorizado" });
    }

    await c.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Error servidor" });
  }
});

module.exports = router;
