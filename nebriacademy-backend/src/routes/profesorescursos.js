// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const ProfesoresCursos = require("../models/ProfesoresCursos.js");

// ── GET ─────────────────────────────────────────────────────────────────────
// GET /profesorescursos — Devuelve todos los vínculos entre profesores y cursos
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

// GET /profesorescursos/:id — Devuelve un vínculo concreto por su ID
router.get("/:id", async (req, res) => {
  try {
    const r = await ProfesoresCursos.findByPk(req.params.id);
    r ? res.json(r) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST ────────────────────────────────────────────────────────────────────
// POST /profesorescursos — Crea un nuevo vínculo entre un profesor y un curso
router.post("/", async (req, res) => {
  try {
    const created = await ProfesoresCursos.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── PUT ─────────────────────────────────────────────────────────────────────
// PUT /profesorescursos/:id — Actualiza un vínculo concreto con los campos que vengan en el body
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

// ── DELETE ──────────────────────────────────────────────────────────────────
// DELETE /profesorescursos/:id — Elimina el vínculo entre un profesor y un curso
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

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
