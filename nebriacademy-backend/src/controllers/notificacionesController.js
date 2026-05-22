const Notificaciones = require("../models/Notificaciones.js");

module.exports = {
  getByUsuario: async (req, res) => {
    try {
      const { usuarioId } = req.params;
      const { tipo } = req.query;
      const whereClause = { usuarioId: parseInt(usuarioId), vista: false };
      if (tipo) whereClause.tipoUsuario = tipo;
      const notificaciones = await Notificaciones.findAll({ where: whereClause, order: [["fecha", "DESC"]] });
      res.json(notificaciones);
    } catch (error) {
      console.error("Error obteniendo notificaciones:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  create: async (req, res) => {
    try {
      const { usuarioId, tipoUsuario, mensaje, enlace } = req.body;
      if (!usuarioId || !mensaje) return res.status(400).json({ error: "Faltan campos obligatorios (usuarioId, mensaje)" });
      const nueva = await Notificaciones.create({ usuarioId: parseInt(usuarioId), tipoUsuario, mensaje, enlace, vista: false, fecha: new Date() });
      res.status(201).json(nueva);
    } catch (error) {
      console.error("Error creando notificación:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  remove: async (req, res) => {
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
  }
};
