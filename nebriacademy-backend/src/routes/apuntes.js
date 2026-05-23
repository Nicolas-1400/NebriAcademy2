// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
// Controlador con la lógica para apuntes
const controller = require("../controllers/apuntesController.js");

// ── RUTAS ────────────────────────────────────────────────────────────────────
router.get("/", controller.listAll); // listar todos los apuntes
router.get("/categorias", controller.categorias); // listar categorías de apuntes
router.get("/:id", controller.getById); // obtener apunte por id
router.post("/", upload.single("archivo"), controller.create); // crear apunte (con archivo)
router.put("/:id", upload.single("archivo"), controller.update); // actualizar apunte
router.delete("/:id", controller.remove); // eliminar apunte

// ── EXPORTAR ────────────────────────────────────────────────────────────────
module.exports = router;
