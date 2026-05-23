// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
// Controlador que gestiona la relación profesores-cursos
const controller = require("../controllers/profesoresCursosController.js");

// ── RUTAS ────────────────────────────────────────────────────────────────────
router.get("/", controller.listAll); // listar todas las relaciones profesor-curso
router.get("/:id", controller.getById); // obtener relación por id
router.post("/", controller.create); // crear relación
router.put("/:id", controller.update); // actualizar relación
router.delete("/:id", controller.remove); // eliminar relación

// ── EXPORTAR ────────────────────────────────────────────────────────────────
module.exports = router;
