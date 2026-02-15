const express = require("express");
const router = express.Router();
const Usuarios = require("../models/Usuarios.js");
const Alumnos = require("../models/Alumnos.js");
const Profesores = require("../models/Profesores.js");
const Administradores = require("../models/Administradores.js");

// Helpers
// Función auxiliar para elegir en qué tabla buscar (Alumnos, Profesores o Administradores)
// dependiendo del tipo de usuario que nos llegue.
const getModelByType = (tipo) => {
  switch (tipo) {
    case "alumno":
      return Alumnos;
    case "profesor":
      return Profesores;
    case "administrador":
      return Administradores;
    default:
      return null;
  }
};

// GET / - Listar bases (Usuarios)
router.get("/", async (req, res) => {
  try {
    const all = await Usuarios.findAll();
    res.json({ "Numero de usuarios": all.length, Usuarios: all });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /:id - Detalle
// Query param 'tipo' opcional para ir directo a la tabla específica
router.get("/:id", async (req, res) => {
  try {
    const { tipo } = req.query;
    if (!tipo) return res.status(400).json({ error: "Falta param tipo" });

    const Model = getModelByType(tipo);
    if (!Model) return res.status(400).json({ error: "Tipo inválido" });

    const u = await Model.findByPk(req.params.id);
    u ? res.json(u) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST / - Crear base
router.post("/", async (req, res) => {
  try {
    const nuevo = await Usuarios.create(req.body);
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /:id - Actualizar (En tabla específica)
router.put("/:id", async (req, res) => {
  try {
    const { tipo } = req.body;
    const Model = getModelByType(tipo);

    if (!Model) return res.status(400).json({ error: "Tipo inválido" });

    const u = await Model.findByPk(req.params.id);
    if (!u) return res.status(404).json({ error: "No encontrado" });

    const updated = await u.update(req.body);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /:id - Eliminar base
router.delete("/:id", async (req, res) => {
  try {
    const u = await Usuarios.findByPk(req.params.id);
    if (!u) return res.status(404).json({ error: "No encontrado" });

    await u.destroy();
    res.json({ mensaje: "Usuario eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
