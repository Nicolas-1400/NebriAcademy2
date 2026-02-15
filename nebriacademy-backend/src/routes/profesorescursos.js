const express = require("express");
const router = express.Router();
const ProfesoresCursos = require("../models/ProfesoresCursos.js");

// GET / - Listar
router.get("/", async (req, res) => {
  try {
    const all = await ProfesoresCursos.findAll();
    res.json({
      "Numero de profesoresCursos": all.length,
      ProfesoresCursos: all,
    });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /:id - Detalle
router.get("/:id", async (req, res) => {
  try {
    const r = await ProfesoresCursos.findByPk(req.params.id);
    r ? res.json(r) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST / - Crear
router.post("/", async (req, res) => {
  try {
    const created = await ProfesoresCursos.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /:id - Actualizar
router.put("/:id", async (req, res) => {
  try {
    const r = await ProfesoresCursos.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "No encontrado" });

    const updated = await r.update(req.body);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /:id - Eliminar
router.delete("/:id", async (req, res) => {
  try {
    const r = await ProfesoresCursos.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "No encontrado" });

    await r.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
