// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const Incidencias = require("../models/Incidencias.js");

// ── GET ─────────────────────────────────────────────────────────────────────
// GET /incidencias — Devuelve todas las incidencias registradas
router.get("/", async (req, res) => {
  try {
    const all = await Incidencias.findAll();
    res.json({ "Numero de incidencias": all.length, Incidencias: all });
  } catch (e) {
    console.error("Error listando incidencias:", e);
    res.status(500).json({ error: "Error de servidor" });
  }
});

// GET /incidencias/:id — Devuelve una incidencia concreta buscándola por su ID
router.get("/:id", async (req, res) => {
  try {
    const i = await Incidencias.findByPk(req.params.id);
    i ? res.json(i) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error de servidor" });
  }
});

// ── POST ────────────────────────────────────────────────────────────────────
// POST /incidencias — Crea una nueva incidencia con los datos del body
router.post("/", async (req, res) => {
  try {
    const created = await Incidencias.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error creando incidencia" });
  }
});

// ── PUT ─────────────────────────────────────────────────────────────────────
// PUT /incidencias/:id — Actualiza los datos de la incidencia; sirve principalmente para marcarla como resuelta
router.put("/:id", async (req, res) => {
  try {
    const i = await Incidencias.findByPk(req.params.id);
    if (!i) return res.status(404).json({ error: "No encontrado" });

    const updated = await i.update(req.body);
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error actualizando" });
  }
});

// ── DELETE ──────────────────────────────────────────────────────────────────
// DELETE /incidencias/:id — Elimina el registro de la incidencia de la base de datos
router.delete("/:id", async (req, res) => {
  try {
    const r = await Incidencias.destroy({ where: { id: req.params.id } });
    r
      ? res.json({ mensaje: "Eliminado" })
      : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error eliminando" });
  }
});

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
