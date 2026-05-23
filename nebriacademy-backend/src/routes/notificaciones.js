// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
// Controlador con la lógica de notificaciones
const controller = require("../controllers/notificacionesController.js");

// ── RUTAS ────────────────────────────────────────────────────────────────────
router.get("/:usuarioId", controller.getByUsuario); // obtener notificaciones de un usuario
router.post("/", controller.create); // crear nueva notificación
router.delete("/:id", controller.remove); // eliminar notificación

// ── EXPORTAR ────────────────────────────────────────────────────────────────
module.exports = router;
