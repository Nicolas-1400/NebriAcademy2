// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
// Controlador con la lógica para cursos
const controller = require("../controllers/cursosController.js");

// ── RUTAS ────────────────────────────────────────────────────────────────────
router.get("/", controller.listAll); // listar todos los cursos
router.get("/categorias", controller.categorias); // listar categorías disponibles
router.get("/:id", controller.getById); // obtener curso por id
router.post("/add", controller.add); // añadir nuevo curso
router.put("/:id", controller.update); // actualizar curso
router.delete("/:id", controller.remove); // eliminar curso

// ── EXPORTAR ────────────────────────────────────────────────────────────────
module.exports = router;
