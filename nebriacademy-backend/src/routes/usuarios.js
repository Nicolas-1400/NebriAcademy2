const express = require("express");
const router = express.Router();
const Usuarios = require("../models/Usuarios.js");

// Obtener todos los usuarios
router.get("/", (req, res) => {
  try {
    console.log("GET /usuarios");
    Usuarios.findAll().then((resultado) => {
      res.json({ "Numero de usuarios": resultado.length, Usuarios: resultado });
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener por ID un usuario
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`GET /usuarios/${id}`);
    Usuarios.findAll().then((resultado) => {
      const usuario = resultado.find((u) => u.id === id);
      if (usuario) {
        res.json(usuario);
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear un usuario
router.post("/", (req, res) => {
  try {
    console.log("POST /usuarios");
    Usuarios.create(req.body).then((nuevo) => {
      res.status(201).json(nuevo);
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar un usuario por ID
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`PUT /usuarios/${id}`);
    Usuarios.findAll().then((resultado) => {
      const usuario = resultado.find((u) => u.id === id);
      if (usuario) {
        usuario.update(req.body).then((actualizado) => res.json(actualizado));
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un usuario por ID
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /usuarios/${id}`);
    Usuarios.findAll().then((resultado) => {
      const usuario = resultado.find((u) => u.id === id);
      if (usuario) {
        usuario
          .destroy()
          .then(() => res.json({ mensaje: "Usuario eliminado" }));
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
