// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
// Controlador con la lógica para vídeos
const controller = require("../controllers/videosController.js");

// ── RUTAS ────────────────────────────────────────────────────────────────────
router.get("/", controller.listAll); // listar todos los vídeos
router.get("/:id", controller.getById); // obtener vídeo por id
router.post("/", upload.single("archivo"), controller.create); // crear vídeo (subida)
router.put("/:id", upload.single("archivo"), controller.update); // actualizar vídeo
router.delete("/:id", controller.remove); // eliminar vídeo

// ── EXPORTAR ────────────────────────────────────────────────────────────────
module.exports = router;
