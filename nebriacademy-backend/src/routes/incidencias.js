const express = require("express");
const router = express.Router();
const Incidencias = require("../models/Incidencias.js");

// Obtener todas las incidencias
router.get("/", (req, res) => {
  try {
    console.log("GET /incidencias");
    Incidencias.findAll().then((resultado) => {
      res.json({
        "Numero de incidencias": resultado.length,
        Incidencias: resultado,
      });
    });
  } catch (error) {
    console.error("Error al obtener incidencias:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener por ID una incidencia
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`GET /incidencias/${id}`);
    Incidencias.findAll().then((resultado) => {
      const incidencia = resultado.find((i) => i.id === id);
      if (incidencia) {
        res.json(incidencia);
      } else {
        res.status(404).json({ error: "Incidencia no encontrada" });
      }
    });
  } catch (error) {
    console.error("Error al obtener incidencia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear una incidencia
router.post("/", (req, res) => {
  try {
    console.log("POST /incidencias");
    Incidencias.create(req.body).then((nuevo) => {
      res.status(201).json(nuevo);
    });
  } catch (error) {
    console.error("Error al crear incidencia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar una incidencia por ID
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`PUT /incidencias/${id}`);
    Incidencias.findAll().then((resultado) => {
      const incidencia = resultado.find((i) => i.id === id);
      if (incidencia) {
        incidencia
          .update(req.body)
          .then((actualizado) => res.json(actualizado));
      } else {
        res.status(404).json({ error: "Incidencia no encontrada" });
      }
    });
  } catch (error) {
    console.error("Error al actualizar incidencia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar una incidencia por ID
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /incidencias/${id}`);
    Incidencias.findAll().then((resultado) => {
      const incidencia = resultado.find((i) => i.id === id);
      if (incidencia) {
        incidencia
          .destroy()
          .then(() => res.json({ mensaje: "Incidencia eliminada" }));
      } else {
        res.status(404).json({ error: "Incidencia no encontrada" });
      }
    });
  } catch (error) {
    console.error("Error al eliminar incidencia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
