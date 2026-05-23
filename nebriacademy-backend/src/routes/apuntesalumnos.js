// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
// Controlador con la lógica para interacción de alumnos con apuntes
const controller = require("../controllers/apuntesAlumnosController.js");

// ── RUTAS ────────────────────────────────────────────────────────────────────
router.get("/", controller.listAll); // listar todas las interacciones
router.get("/registro", controller.registro); // obtener registro de apuntes
router.post("/vote", controller.vote); // votar un apunte
router.get("/likes", controller.likes); // listar apuntes con likes

// ── EXPORTAR ────────────────────────────────────────────────────────────────
module.exports = router;
