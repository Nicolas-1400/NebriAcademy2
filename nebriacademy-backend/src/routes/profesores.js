// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
// Controlador con la lógica para profesores
const controller = require("../controllers/profesoresController.js");

// ── RUTAS ────────────────────────────────────────────────────────────────────
router.get("/", controller.listAll); // listar todos los profesores
router.get("/especializaciones", controller.especializaciones); // listar especializaciones
router.get("/:id", controller.getById); // obtener profesor por id
router.put("/:id", controller.update); // actualizar profesor
router.delete("/:id", controller.remove); // eliminar profesor

// Rutas para creación/verificación y cambios de cuenta
router.post("/admin/crear", controller.adminCrear); // crear profesor por admin
router.post("/verificacionprofesor/auth", controller.verificacionAuth); // iniciar verificación
router.post("/verificacionprofesor/completar", controller.verificacionCompletar); // completar verificación
router.post("/cambiar-cuenta", controller.cambiarCuenta); // cambiar tipo de cuenta

// ── EXPORTAR ────────────────────────────────────────────────────────────────
module.exports = router;
