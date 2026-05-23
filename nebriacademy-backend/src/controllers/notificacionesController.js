// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const Notificaciones = require("../models/Notificaciones.js");

// ── CONTROLADOR: notificaciones ─────────────────────────────────────────────
// Obtener, crear y borrar notificaciones para usuarios

// Obtener notificaciones no vistas de un usuario (opcional por tipo)
exports.getByUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const { tipo } = req.query;

    // Filtramos siempre por usuarioId y vista=false; el tipo de usuario es opcional
    const whereClause = { usuarioId: parseInt(usuarioId), vista: false };
    if (tipo) whereClause.tipoUsuario = tipo;

    const notificaciones = await Notificaciones.findAll({ where: whereClause, order: [["fecha", "DESC"]] });
    res.json(notificaciones);
  } catch (error) {
    console.error("Error obteniendo notificaciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear una nueva notificación para un usuario
exports.create = async (req, res) => {
  try {
    const { usuarioId, tipoUsuario, mensaje, enlace } = req.body;
    if (!usuarioId || !mensaje) return res.status(400).json({ error: "Faltan campos obligatorios (usuarioId, mensaje)" });

    // Creamos la notificación marcada como no vista por defecto
    const nueva = await Notificaciones.create({ usuarioId: parseInt(usuarioId), tipoUsuario, mensaje, enlace, vista: false, fecha: new Date() });
    res.status(201).json(nueva);
  } catch (error) {
    console.error("Error creando notificación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar una notificación por id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const notificacion = await Notificaciones.findByPk(id);
    if (!notificacion) return res.status(404).json({ error: "Notificación no encontrada" });
    await notificacion.destroy();
    res.json({ mensaje: "Notificación eliminada permanentemente" });
  } catch (error) {
    console.error("Error eliminando notificación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
