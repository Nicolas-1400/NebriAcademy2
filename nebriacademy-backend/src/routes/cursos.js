const express = require("express");
const router = express.Router();
const controller = require("../controllers/cursosController.js");

router.get("/", controller.listAll);
router.get("/categorias", controller.categorias);
router.get("/:id", controller.getById);
router.post("/add", controller.add);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
