
const express = require("express");
const router = express.Router();
const controller = require("../controllers/alumnosController.js");

router.get("/", controller.listAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

router.post("/admin/crear", controller.postAdminCrear);
router.post("/registerAlumnoExterno/auth", controller.registerAlumnoExterno);
router.post("/verificacionnebrija/auth", controller.verificacionNeijrjaAuth);
router.post("/verificacionnebrija/completar", controller.verificacionNeijrjaCompletar);

module.exports = router;
