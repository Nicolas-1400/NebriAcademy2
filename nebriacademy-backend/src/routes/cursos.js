const express = require("express");
const router = express.Router();
const Cursos = require("../models/Cursos.js");

// Obtener todos los cursos
router.get("/", (req, res) => {
  try {
    console.log("GET /cursos");
    Cursos.findAll().then((resultado) => {
      res.json({ "Numero de cursos": resultado.length, Cursos: resultado });
    });
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener por ID un curso
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`GET /cursos/${id}`);
    Cursos.findAll().then((resultado) => {
      const curso = resultado.find((c) => c.id === id);
      if (curso) {
        res.json(curso);
      } else {
        res.status(404).json({ error: "Curso no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al obtener curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear un curso
router.post("/", (req, res) => {
  try {
    console.log("POST /cursos");
    Cursos.create(req.body).then((nuevo) => {
      res.status(201).json(nuevo);
    });
  } catch (error) {
    console.error("Error al crear curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar un curso por ID
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`PUT /cursos/${id}`);
    Cursos.findAll().then((resultado) => {
      const curso = resultado.find((c) => c.id === id);
      if (curso) {
        curso.update(req.body).then((actualizado) => res.json(actualizado));
      } else {
        res.status(404).json({ error: "Curso no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al actualizar curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un curso por ID
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /cursos/${id}`);
    Cursos.findAll().then((resultado) => {
      const curso = resultado.find((c) => c.id === id);
      if (curso) {
        curso.destroy().then(() => res.json({ mensaje: "Curso eliminado" }));
      } else {
        res.status(404).json({ error: "Curso no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
