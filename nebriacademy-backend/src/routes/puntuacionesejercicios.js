// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
// Controlador con la lógica para las puntuaciones de ejercicios
const controller = require("../controllers/puntuacionesEjerciciosController.js");

// ── RUTAS ────────────────────────────────────────────────────────────────────
router.get("/", controller.listAll); // listar todas las puntuaciones
router.get("/:id", controller.getById); // obtener por id
router.post("/", controller.create); // crear nueva puntuación
router.put("/:id", controller.update); // actualizar existente
router.delete("/:id", controller.remove); // eliminar

// ── EXPORTAR ────────────────────────────────────────────────────────────────
module.exports = router;
