const express = require("express");
const router = express.Router();
const controller = require("../controllers/cursosAlumnosController.js");

router.get("/", controller.listAll);
router.get("/registro", controller.registro);
router.get("/:id", controller.getById);
router.post("/vote", controller.vote);
router.post("/toggle-fav", controller.toggleFav);
router.post("/toggle-apuntado", controller.toggleApuntado);
router.post("/comment", controller.comment);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
