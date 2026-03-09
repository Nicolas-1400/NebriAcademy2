// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const Usuarios = require("../models/Usuarios.js");
const Alumnos = require("../models/Alumnos.js");
const Profesores = require("../models/Profesores.js");
const Administradores = require("../models/Administradores.js");

// ── FUNCIONES AUXILIARES ─────────────────────────────────────────────────────
// Función auxiliar que devuelve el modelo correcto según el tipo de usuario recibido
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

// ── GET ─────────────────────────────────────────────────────────────────────
// GET /usuarios — Devuelve todos los registros de la tabla usuarios
router.get("/", async (req, res) => {
  try {
    const all = await Usuarios.findAll();
    res.json({ "Numero de usuarios": all.length, Usuarios: all });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /usuarios/:id — Devuelve un usuario concreto. Requiere el query param "tipo" para saber en qué tabla buscar
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

// ── POST ────────────────────────────────────────────────────────────────────
// POST /usuarios — Crea un nuevo registro en la tabla base de usuarios
router.post("/", async (req, res) => {
  try {
    const nuevo = await Usuarios.create(req.body);
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── PUT ─────────────────────────────────────────────────────────────────────
// PUT /usuarios/:id — Actualiza los datos de un usuario. El tipo en el body determina en qué tabla buscar
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

// ── DELETE ──────────────────────────────────────────────────────────────────
// DELETE /usuarios/:id — Elimina el registro de la tabla usuarios 
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

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
