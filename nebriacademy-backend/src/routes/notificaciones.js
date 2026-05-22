const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificacionesController.js");

router.get("/:usuarioId", controller.getByUsuario);
router.post("/", controller.create);
router.delete("/:id", controller.remove);

module.exports = router;
