// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
// Controlador con la lógica para cursos-alumnos (votos, favoritos, apuntados)
const controller = require("../controllers/cursosAlumnosController.js");

// ── RUTAS ────────────────────────────────────────────────────────────────────
router.get("/", controller.listAll); // listar todas las relaciones
router.get("/registro", controller.registro); // registro de alumnos en cursos
router.get("/:id", controller.getById); // obtener relación por id
router.post("/vote", controller.vote); // votar en un curso
router.post("/toggle-fav", controller.toggleFav); // marcar/desmarcar favorito
router.post("/toggle-apuntado", controller.toggleApuntado); // apuntarse/desapuntarse
router.post("/comment", controller.comment); // comentar en curso
router.put("/:id", controller.update); // actualizar relación
router.delete("/:id", controller.remove); // eliminar relación

// ── EXPORTAR ────────────────────────────────────────────────────────────────
module.exports = router;
