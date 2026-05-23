// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
// Controlador con la lógica para administradores
const controller = require("../controllers/administradoresController.js");

// ── RUTAS ────────────────────────────────────────────────────────────────────
router.get("/", controller.listAll); // listar todos los administradores
router.get("/:id", controller.getById); // obtener administrador por id
router.post("/", controller.create); // crear nuevo administrador
router.put("/:id", controller.update); // actualizar administrador existente
router.delete("/:id", controller.remove); // eliminar administrador

// ── EXPORTAR ────────────────────────────────────────────────────────────────
module.exports = router;
