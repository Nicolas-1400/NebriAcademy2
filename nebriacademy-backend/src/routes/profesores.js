const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const controller = require("../controllers/profesoresController.js");

router.get("/", controller.listAll);
router.get("/especializaciones", controller.especializaciones);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

router.post("/admin/crear", controller.adminCrear);
router.post("/verificacionprofesor/auth", controller.verificacionAuth);
router.post("/verificacionprofesor/completar", controller.verificacionCompletar);
router.post("/cambiar-cuenta", controller.cambiarCuenta);

module.exports = router;
