const express = require("express");
const router = express.Router();
const Administradores = require("../models/Administradores.js");

// Rutas de Obtención
router.get("/", async (req, res) => {
  try {
    const todos = await Administradores.findAll();
    res.json({
      "Numero de administradores": todos.length,
      Administradores: todos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error de servidor" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const admin = await Administradores.findByPk(req.params.id);
    admin ? res.json(admin) : res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error de servidor" });
  }
});

// Rutas de Creación
router.post("/", async (req, res) => {
  try {
    const nuevo = await Administradores.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando administrador" });
  }
});

// Rutas de Actualización
router.put("/:id", async (req, res) => {
  try {
    const admin = await Administradores.findByPk(req.params.id);
    if (!admin) return res.status(404).json({ error: "No encontrado" });

    const actualizado = await admin.update(req.body);
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando" });
  }
});

// Rutas de Eliminación
router.delete("/:id", async (req, res) => {
  try {
    const filas = await Administradores.destroy({
      where: { id: req.params.id },
    });
    filas
      ? res.json({ mensaje: "Eliminado" })
      : res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando" });
  }
});

module.exports = router;
