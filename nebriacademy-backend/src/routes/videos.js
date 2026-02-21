const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Videos = require("../models/Videos.js");
const Profesores = require("../models/Profesores.js");

const uploadDir = path.join(
  __dirname,
  "../../../nebriacademy-frontend/src/assets/Videos",
);
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, path.basename(file.originalname)),
  }),
});

router.get("/", async (req, res) => {
  try {
    const all = await Videos.findAll();
    res.json({ "Numero de videos": all.length, Videos: all });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const v = await Videos.findByPk(req.params.id);
    v ? res.json(v) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido" });
    const { nombre, curso, profileId, tipo } = req.body;

    if (!nombre || !curso || !profileId || !tipo)
      return res.status(400).json({ error: "Datos incompletos" });

    let profesorId = null;

    if (tipo === "profesor") {
      const p = await Profesores.findByPk(profileId);
      if (p) profesorId = p.id;
    }

    if (!profesorId)
      return res
        .status(400)
        .json({ error: "Profesor no identificado o no autorizado" });

    const nuevo = await Videos.create({
      autor: profesorId,
      curso,
      nombre,
      archivo: req.file.filename,
      valoracion: 0,
    });

    res.status(201).json({ id: nuevo.id, archivo: nuevo.archivo });
  } catch (e) {
    console.error("Error creando video:", e);
    res.status(500).json({ error: "Error creando video" });
  }
});

router.put("/:id", upload.single("archivo"), async (req, res) => {
  try {
    const v = await Videos.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: "No encontrado" });

    const updates = { ...req.body };
    if (req.file) updates.archivo = req.file.filename;

    const updated = await v.update(updates);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const v = await Videos.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: "No encontrado" });

    if (v.archivo) {
      const p = path.join(uploadDir, v.archivo);
      fs.promises.unlink(p).catch(() => {});
    }

    await v.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
