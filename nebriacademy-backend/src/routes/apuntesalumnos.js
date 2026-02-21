// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const ApuntesAlumnos = require("../models/ApuntesAlumnos.js");
const Apuntes = require("../models/Apuntes.js");

// ── GET ─────────────────────────────────────────────────────────────────────
// GET /apuntesalumnos — Devuelve todos los registros de la relación alumno-apunte
router.get("/", async (req, res) => {
  try {
    const all = await ApuntesAlumnos.findAll();
    res.json({ "Numero de registros": all.length, ApuntesAlumnos: all });
  } catch (e) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

// GET /apuntesalumnos/registro — Busca el registro concreto de un alumno en un apunte (por query params)
router.get("/registro", async (req, res) => {
  try {
    const { apunteId, alumnoId } = req.query;
    if (!apunteId || !alumnoId)
      return res.status(400).json({ error: "Faltan parámetros" });

    const registro = await ApuntesAlumnos.findOne({
      where: { apunteId, alumnoId },
    });
    res.json(registro || {});
  } catch (e) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

// ── POST ────────────────────────────────────────────────────────────────────
// POST /apuntesalumnos/vote — Gestiona el like de un alumno sobre un apunte.
// Si ya tiene like, se lo quitamos (toggle). Si no tenía, se lo añadimos.
router.post("/vote", async (req, res) => {
  try {
    const { apunteId, alumnoId, vote } = req.body;
    if (!apunteId || !alumnoId || vote !== true) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    // Si no existe registro para este alumno y apunte, lo creamos con megusta: null
    const [registro] = await ApuntesAlumnos.findOrCreate({
      where: { apunteId, alumnoId },
      defaults: { megusta: null },
    });

    // Si ya tenía like, lo cancelamos; si no tenía, lo activamos
    const isLike = registro.megusta === true;
    const nuevoValor = isLike ? null : true;
    const cambioValoracion = isLike ? -1 : 1;

    const apunte = await Apuntes.findByPk(apunteId);
    if (!apunte) return res.status(404).json({ error: "Apunte no encontrado" });

    // Actualizamos la valoración total del apunte sumando o restando 1
    const nuevaNota = (apunte.valoracion || 0) + cambioValoracion;
    await apunte.update({ valoracion: nuevaNota });

    // Guardamos el nuevo estado del like del alumno
    await registro.update({ megusta: nuevoValor });

    res.json({
      registro: { apunteId, alumnoId, valoracion: nuevoValor },
      apunte: { id: apunte.id, valoracion: nuevaNota },
    });
  } catch (error) {
    console.error("Error votando apunte:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// GET /apuntesalumnos/likes — Devuelve los IDs de los apuntes que le gustan a un alumno concreto
router.get("/likes", async (req, res) => {
  try {
    const { alumnoId } = req.query;
    if (!alumnoId) return res.status(400).json({ error: "Falta alumnoId" });

    // Buscamos todos los registros donde el alumno haya dado like
    const likes = await ApuntesAlumnos.findAll({
      where: { alumnoId, megusta: true },
      attributes: ["apunteId"],
    });

    res.json({ apunteIds: likes.map((l) => l.apunteId) });
  } catch (e) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
