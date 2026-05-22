const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const controller = require("../controllers/apuntesController.js");

router.get("/", controller.listAll);
router.get("/categorias", controller.categorias);
router.get("/:id", controller.getById);
router.post("/", upload.single("archivo"), controller.create);
router.put("/:id", upload.single("archivo"), controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
