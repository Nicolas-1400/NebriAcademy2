const express = require("express");
const router = express.Router();
const Videos = require("../models/Videos.js");

// Obtener todos los videos
router.get("/", (req, res) => {
  try {
    console.log("GET /videos");
    Videos.findAll().then((resultado) => {
      res.json({ "Numero de videos": resultado.length, Videos: resultado });
    });
  } catch (error) {
    console.error("Error al obtener videos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener por ID un video
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`GET /videos/${id}`);
    Videos.findAll().then((resultado) => {
      const video = resultado.find((v) => v.id === id);
      if (video) {
        res.json(video);
      } else {
        res.status(404).json({ error: "Video no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al obtener video:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear un video
router.post("/", (req, res) => {
  try {
    console.log("POST /videos");
    Videos.create(req.body).then((nuevo) => {
      res.status(201).json(nuevo);
    });
  } catch (error) {
    console.error("Error al crear video:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar un video por ID
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`PUT /videos/${id}`);
    Videos.findAll().then((resultado) => {
      const video = resultado.find((v) => v.id === id);
      if (video) {
        video.update(req.body).then((actualizado) => res.json(actualizado));
      } else {
        res.status(404).json({ error: "Video no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al actualizar video:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un video por ID
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /videos/${id}`);
    Videos.findAll().then((resultado) => {
      const video = resultado.find((v) => v.id === id);
      if (video) {
        video.destroy().then(() => res.json({ mensaje: "Video eliminado" }));
      } else {
        res.status(404).json({ error: "Video no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al eliminar video:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
