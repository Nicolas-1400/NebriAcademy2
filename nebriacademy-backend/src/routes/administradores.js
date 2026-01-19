const express = require("express");
const router = express.Router();
const Administradores = require("../models/Administradores.js");

// Obtener todos los administradores
router.get("/", (req, res) => {
  try {
    console.log("GET /administradores");
    Administradores.findAll().then((resultado) => {
      res.json({
        "Numero de administradores": resultado.length,
        Administradores: resultado,
      });
    });
  } catch (error) {
    console.error("Error al obtener administradores:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener por ID un administrador
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`GET /administradores/${id}`);
    Administradores.findAll().then((resultado) => {
      const administrador = resultado.find((a) => a.id === id);
      if (administrador) {
        res.json(administrador);
      } else {
        res.status(404).json({ error: "Administrador no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al obtener administrador:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear un administrador
router.post("/", (req, res) => {
  try {
    console.log("POST /administradores");
    Administradores.create(req.body).then((nuevo) => {
      res.status(201).json(nuevo);
    });
  } catch (error) {
    console.error("Error al crear administrador:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar un administrador por ID
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`PUT /administradores/${id}`);
    Administradores.findAll().then((resultado) => {
      const administrador = resultado.find((a) => a.id === id);
      if (administrador) {
        administrador
          .update(req.body)
          .then((actualizado) => res.json(actualizado));
      } else {
        res.status(404).json({ error: "Administrador no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al actualizar administrador:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un administrador por ID
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /administradores/${id}`);
    Administradores.findAll().then((resultado) => {
      const administrador = resultado.find((a) => a.id === id);
      if (administrador) {
        administrador
          .destroy()
          .then(() => res.json({ mensaje: "Administrador eliminado" }));
      } else {
        res.status(404).json({ error: "Administrador no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al eliminar administrador:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
