// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
// Controlador con la lógica para entregas de ejercicios (alumnos)
const controller = require("../controllers/ejerciciosAlumnosController.js");

// ── RUTAS ────────────────────────────────────────────────────────────────────
router.get("/", controller.listAll); // listar todas las entregas
router.get("/:id", controller.getById); // obtener entrega por id
router.post("/", upload.single("archivo"), controller.create); // crear entrega (con archivo)
router.put("/:id", upload.single("archivo"), controller.update); // actualizar entrega
router.delete("/:id", controller.remove); // eliminar entrega

// ── EXPORTAR ────────────────────────────────────────────────────────────────
module.exports = router;
