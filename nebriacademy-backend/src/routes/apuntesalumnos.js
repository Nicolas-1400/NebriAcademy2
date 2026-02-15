const express = require("express");
const router = express.Router();
const ApuntesAlumnos = require("../models/ApuntesAlumnos.js");
const Apuntes = require("../models/Apuntes.js");

// GET / - Listar todos
router.get("/", async (req, res) => {
  try {
    const all = await ApuntesAlumnos.findAll();
    res.json({ "Numero de registros": all.length, ApuntesAlumnos: all });
  } catch (e) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

// GET /registro - Buscar por apunteId y alumnoId
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

/**
 * POST /vote
 * Alterna "me gusta" en un apunte.
 * Actualiza el registro ApuntesAlumnos y el contador en Apuntes.
 */
router.post("/vote", async (req, res) => {
  try {
    const { apunteId, alumnoId, vote } = req.body;
    if (!apunteId || !alumnoId || vote !== true) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    // 1. Obtener/Crear registro de interacción
    const [registro] = await ApuntesAlumnos.findOrCreate({
      where: { apunteId, alumnoId },
      defaults: { megusta: null },
    });

    // 2. Calcular nuevo valor (Toggle)
    // Si ya tiene like (megusta=true), lo quitamos (null). Si no, lo ponemos (true).
    const isLike = registro.megusta === true;
    const nuevoValor = isLike ? null : true;
    const cambioValoracion = isLike ? -1 : 1;

    // 3. Actualizar Apunte (Contador global)
    const apunte = await Apuntes.findByPk(apunteId);
    if (!apunte) return res.status(404).json({ error: "Apunte no encontrado" });

    const nuevaNota = (apunte.valoracion || 0) + cambioValoracion;
    await apunte.update({ valoracion: nuevaNota });

    // 4. Actualizar Registro usuario
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

// GET /likes - IDs de apuntes que gustan al alumno
router.get("/likes", async (req, res) => {
  try {
    const { alumnoId } = req.query;
    if (!alumnoId) return res.status(400).json({ error: "Falta alumnoId" });

    const likes = await ApuntesAlumnos.findAll({
      where: { alumnoId, megusta: true },
      attributes: ["apunteId"],
    });

    res.json({ apunteIds: likes.map((l) => l.apunteId) });
  } catch (e) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
