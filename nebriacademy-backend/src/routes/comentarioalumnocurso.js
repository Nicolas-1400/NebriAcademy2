// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
// Controlador con la lógica para comentarios de alumnos en cursos
const controller = require("../controllers/comentarioAlumnoCursoController.js");

// ── RUTAS ────────────────────────────────────────────────────────────────────
router.get("/", controller.listAll); // listar todos los comentarios
router.get("/:id", controller.getById); // obtener comentario por id
router.post("/", controller.create); // crear comentario
router.put("/:id", controller.update); // actualizar comentario
router.delete("/:id", controller.remove); // eliminar comentario

// ── EXPORTAR ────────────────────────────────────────────────────────────────
module.exports = router;
