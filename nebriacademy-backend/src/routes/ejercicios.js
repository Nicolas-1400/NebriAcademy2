const express = require("express");
const router = express.Router();
const Ejercicios = require("../models/Ejercicios.js");

// Obtener todos los ejercicios
router.get("/", (req, res) => {
  try {
    console.log("GET /ejercicios");
    Ejercicios.findAll().then((resultado) => {
      res.json({
        "Numero de ejercicios": resultado.length,
        Ejercicios: resultado,
      });
    });
  } catch (error) {
    console.error("Error al obtener ejercicios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener por ID un ejercicio
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`GET /ejercicios/${id}`);
    Ejercicios.findAll().then((resultado) => {
      const ejercicio = resultado.find((e) => e.id === id);
      if (ejercicio) {
        res.json(ejercicio);
      } else {
        res.status(404).json({ error: "Ejercicio no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al obtener ejercicio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear un ejercicio
router.post("/", (req, res) => {
  try {
    console.log("POST /ejercicios");
    Ejercicios.create(req.body).then((nuevo) => {
      res.status(201).json(nuevo);
    });
  } catch (error) {
    console.error("Error al crear ejercicio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar un ejercicio por ID
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`PUT /ejercicios/${id}`);
    Ejercicios.findAll().then((resultado) => {
      const ejercicio = resultado.find((e) => e.id === id);
      if (ejercicio) {
        ejercicio.update(req.body).then((actualizado) => res.json(actualizado));
      } else {
        res.status(404).json({ error: "Ejercicio no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al actualizar ejercicio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un ejercicio por ID
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /ejercicios/${id}`);
    Ejercicios.findAll().then((resultado) => {
      const ejercicio = resultado.find((e) => e.id === id);
      if (ejercicio) {
        ejercicio
          .destroy()
          .then(() => res.json({ mensaje: "Ejercicio eliminado" }));
      } else {
        res.status(404).json({ error: "Ejercicio no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al eliminar ejercicio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
