// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
// Controlador con la lógica para ejercicios
const controller = require("../controllers/ejerciciosController.js");

// ── RUTAS ────────────────────────────────────────────────────────────────────
router.get("/", controller.listAll); // listar todos los ejercicios
router.get("/:id", controller.getById); // obtener ejercicio por id
router.post("/", upload.single("archivo"), controller.create); // crear ejercicio
router.put("/:id", upload.single("archivo"), controller.update); // actualizar ejercicio
router.delete("/:id", controller.remove); // eliminar ejercicio

// ── EXPORTAR ────────────────────────────────────────────────────────────────
module.exports = router;
