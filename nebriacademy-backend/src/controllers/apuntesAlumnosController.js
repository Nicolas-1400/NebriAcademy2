// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const ApuntesAlumnos = require("../models/ApuntesAlumnos.js");
const Apuntes = require("../models/Apuntes.js");

// ── CONTROLADOR: apuntesAlumnos ──────────────────────────────────────────────
// Registra interacciones de alumnos con apuntes (votos, likes, registros)

// Listar registros de interacción alumno-apunte
exports.listAll = async (req, res) => {
  try {
    const all = await ApuntesAlumnos.findAll();
    res.json({ "Numero de registros": all.length, ApuntesAlumnos: all });
  } catch (e) {
    res.status(500).json({ error: "Error del servidor" });
  }
};

// Obtener registro específico de un alumno sobre un apunte
exports.registro = async (req, res) => {
  try {
    const { apunteId, alumnoId } = req.query;
    if (!apunteId || !alumnoId)
      return res.status(400).json({ error: "Faltan parámetros" });

    const registro = await ApuntesAlumnos.findOne({ where: { apunteId, alumnoId } });
    res.json(registro || {});
  } catch (e) {
    res.status(500).json({ error: "Error del servidor" });
  }
};

// Votar/alternar "me gusta" en un apunte y actualizar valoración
exports.vote = async (req, res) => {
  try {
    const { apunteId, alumnoId, vote } = req.body;
    if (!apunteId || !alumnoId || vote !== true) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    // Buscamos o creamos el registro alumno-apunte para este par
    const [registro] = await ApuntesAlumnos.findOrCreate({
      where: { apunteId, alumnoId },
      defaults: { megusta: null },
    });

    const isLiked = registro.megusta === true;
    // Si ya tenía like, lo quitamos (toggle); si no, lo ponemos
    const nuevoValor = isLiked ? null : true;
    // El cambio en la valoración es -1 si quitamos el like, +1 si lo añadimos
    const cambioValoracion = isLiked ? -1 : 1;

    const apunte = await Apuntes.findByPk(apunteId);
    if (!apunte) return res.status(404).json({ error: "Apunte no encontrado" });

    // Actualizamos la valoración acumulada del apunte y el estado del registro
    const nuevaNota = (apunte.valoracion || 0) + cambioValoracion;
    await apunte.update({ valoracion: nuevaNota });

    await registro.update({ megusta: nuevoValor });

    res.json({
      registro: { apunteId, alumnoId, valoracion: nuevoValor },
      apunte: { id: apunte.id, valoracion: nuevaNota },
    });
  } catch (error) {
    console.error("Error votando apunte:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};

// Listar apunteIds que un alumno ha marcado como "me gusta"
exports.likes = async (req, res) => {
  try {
    const { alumnoId } = req.query;
    if (!alumnoId) return res.status(400).json({ error: "Falta alumnoId" });

    // Recuperamos solo el campo apunteId para minimizar la carga de datos
    const likes = await ApuntesAlumnos.findAll({
      where: { alumnoId, megusta: true },
      attributes: ["apunteId"],
    });

    res.json({ apunteIds: likes.map((l) => l.apunteId) });
  } catch (e) {
    res.status(500).json({ error: "Error del servidor" });
  }
};
