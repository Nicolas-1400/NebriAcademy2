const express = require("express");
const router = express.Router();
const PuntuacionesEjercicios = require("../models/PuntuacionesEjercicios.js");

// GET / - Listar
router.get("/", async (req, res) => {
  try {
    const all = await PuntuacionesEjercicios.findAll();
    res.json({
      "Numero de puntuacionesEjercicios": all.length,
      PuntuacionesEjercicios: all,
    });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /:id - Detalle
router.get("/:id", async (req, res) => {
  try {
    const p = await PuntuacionesEjercicios.findByPk(req.params.id);
    p ? res.json(p) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST / - Crear
router.post("/", async (req, res) => {
  try {
    const created = await PuntuacionesEjercicios.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /:id - Actualizar
router.put("/:id", async (req, res) => {
  try {
    const p = await PuntuacionesEjercicios.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: "No encontrado" });

    const updated = await p.update(req.body);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /:id - Eliminar
router.delete("/:id", async (req, res) => {
  try {
    const p = await PuntuacionesEjercicios.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: "No encontrado" });

    await p.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
