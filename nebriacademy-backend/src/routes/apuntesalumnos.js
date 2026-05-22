const express = require("express");
const router = express.Router();
const controller = require("../controllers/apuntesAlumnosController.js");

router.get("/", controller.listAll);
router.get("/registro", controller.registro);
router.post("/vote", controller.vote);
router.get("/likes", controller.likes);

module.exports = router;
