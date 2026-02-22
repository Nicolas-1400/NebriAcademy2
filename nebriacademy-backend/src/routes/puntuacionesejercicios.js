// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const PuntuacionesEjercicios = require("../models/PuntuacionesEjercicios.js");

// ── GET ─────────────────────────────────────────────────────────────────────
// GET /puntuacionesejercicios — Devuelve todas las puntuaciones registradas
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

// GET /puntuacionesejercicios/:id — Devuelve una puntuación concreta por su ID
router.get("/:id", async (req, res) => {
  try {
    const p = await PuntuacionesEjercicios.findByPk(req.params.id);
    p ? res.json(p) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST ────────────────────────────────────────────────────────────────────
// POST /puntuacionesejercicios — Crea una nueva puntuación para la entrega de un alumno
router.post("/", async (req, res) => {
  try {
    const created = await PuntuacionesEjercicios.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── PUT ─────────────────────────────────────────────────────────────────────
// PUT /puntuacionesejercicios/:id — Actualiza la nota de una entrega ya calificada
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

// ── DELETE ──────────────────────────────────────────────────────────────────
// DELETE /puntuacionesejercicios/:id — Elimina la puntuación de una entrega 
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

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
