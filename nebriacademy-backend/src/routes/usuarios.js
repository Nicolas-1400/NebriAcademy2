// Rutas delegadas a controlador de `usuarios`
const express = require("express");
const router = express.Router();
const controller = require("../controllers/usuariosController.js");

router.get("/", controller.listAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
