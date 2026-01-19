const express = require("express");
const router = express.Router();
const Alumnos = require("../models/Alumnos.js");

// Obtener todos los alumnos
router.get("/", (req, res) => {
  try {
    console.log("GET /alumnos");
    Alumnos.findAll().then((resultado) => {
      res.json({ "Numero de alumnos": resultado.length, Alumnos: resultado });
    });
  } catch (error) {
    console.error("Error al obtener alumnos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener por ID un alumno
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`GET /alumnos/${id}`);
    Alumnos.findAll().then((resultado) => {
      const alumno = resultado.find((a) => a.id === id);
      if (alumno) {
        res.json(alumno);
      } else {
        res.status(404).json({ error: "Alumno no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al obtener alumno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear un alumno
router.post("/", (req, res) => {
  try {
    console.log("POST /alumnos");
    Alumnos.create(req.body).then((nuevo) => {
      res.status(201).json(nuevo);
    });
  } catch (error) {
    console.error("Error al crear alumno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar un alumno por ID
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`PUT /alumnos/${id}`);
    Alumnos.findAll().then((resultado) => {
      const alumno = resultado.find((a) => a.id === id);
      if (alumno) {
        alumno.update(req.body).then((actualizado) => res.json(actualizado));
      } else {
        res.status(404).json({ error: "Alumno no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al actualizar alumno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un alumno por ID
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /alumnos/${id}`);
    Alumnos.findAll().then((resultado) => {
      const alumno = resultado.find((a) => a.id === id);
      if (alumno) {
        alumno.destroy().then(() => res.json({ mensaje: "Alumno eliminado" }));
      } else {
        res.status(404).json({ error: "Alumno no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al eliminar alumno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
