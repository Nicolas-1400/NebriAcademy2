const express = require("express");
const router = express.Router();
const Apuntes = require("../models/Apuntes.js");
const multer = require("multer");
const path = require("path");
const Profesores = require("../models/Profesores.js");
const Usuarios = require("../models/Usuarios.js");

// Multer: guarda en la carpeta de assets del frontend
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "..", "nebriacademy-frontend", "src", "assets", "Apuntes"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Obtener todos los apuntes
router.get("/", (req, res) => {
  try {
    console.log("GET /apuntes");
    Apuntes.findAll().then((resultado) => {
      res.json({ "Numero de apuntes": resultado.length, Apuntes: resultado });
    });
  } catch (error) {
    console.error("Error al obtener apuntes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener por ID un apunte
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`GET /apuntes/${id}`);
    Apuntes.findAll().then((resultado) => {
      const apunte = resultado.find((a) => a.id === id);
      if (apunte) {
        res.json(apunte);
      } else {
        res.status(404).json({ error: "Apunte no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al obtener apunte:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear un apunte (subida de archivo)
router.post("/", upload.single('archivo'), async (req, res) => {
  try {

    let autorInput = req.body.autor ? parseInt(req.body.autor) : null;
    const curso = req.body.curso ? parseInt(req.body.curso) : null;
    let autor = null;
    if (autorInput) {
      // Try as Usuarios id
      const u = await Usuarios.findByPk(autorInput);
      if (u) {
        autor = autorInput;
      } else {
        // Try as Profesor id -> map to usuarioId
        const p = await Profesores.findByPk(autorInput);
        if (p && p.usuarioId) {
          autor = p.usuarioId;
        }
      }
    }
    // Requerimos archivo; si no llega, devolvemos 400
    if (!req.file) {
      return res.status(400).json({ error: "Campo 'archivo' es requerido (multipart/form-data)" });
    }
    const archivo = req.file.filename;
    const descripcion = req.body.descripcion || null;

    const nuevo = await Apuntes.create({ autor, curso, archivo, descripcion, valoracion: 0 });

    return res.status(201).json({ id: nuevo.id, archivo });
  } catch (error) {
    console.error("Error al crear apunte:", error);
    return res.status(500).json({ error: "Error interno del servidor", detail: error.message });
  }
});

// Actualizar un apunte por ID
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`PUT /apuntes/${id}`);
    Apuntes.findAll().then((resultado) => {
      const apunte = resultado.find((a) => a.id === id);
      if (apunte) {
        apunte.update(req.body).then((actualizado) => res.json(actualizado));
      } else {
        res.status(404).json({ error: "Apunte no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al actualizar apunte:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un apunte por ID
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /apuntes/${id}`);
    Apuntes.findAll().then((resultado) => {
      const apunte = resultado.find((a) => a.id === id);
      if (apunte) {
        apunte.destroy().then(() => res.json({ mensaje: "Apunte eliminado" }));
      } else {
        res.status(404).json({ error: "Apunte no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al eliminar apunte:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
