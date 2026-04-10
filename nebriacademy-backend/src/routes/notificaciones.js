// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const Notificaciones = require("../models/Notificaciones.js");

// ── GET ─────────────────────────────────────────────────────────────────────
// Obtener notificaciones para un usuario específico donde vista = false
router.get("/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    // Opcional: Recibir tipo de usuario si fuese necesario para distinguir misma ID entre tablas
    const { tipo } = req.query; 

    const whereClause = {
      usuarioId: parseInt(usuarioId),
      vista: false,
    };
    
    if (tipo) {
      whereClause.tipoUsuario = tipo;
    }

    const notificaciones = await Notificaciones.findAll({
      where: whereClause,
      order: [["fecha", "DESC"]], // Más recientes primero
    });

    res.json(notificaciones);
  } catch (error) {
    console.error("Error obteniendo notificaciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ── PUT ─────────────────────────────────────────────────────────────────────
// Marcar una notificación como vista
router.put("/:id/vista", async (req, res) => {
  try {
    const { id } = req.params;
    
    const notificacion = await Notificaciones.findByPk(id);
    if (!notificacion) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }

    await notificacion.update({ vista: true });
    
    res.json({ mensaje: "Notificación marcada como vista", notificacion });
  } catch (error) {
    console.error("Error actualizando notificación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
