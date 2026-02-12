const express = require("express");
const router = express.Router();
const Videos = require("../models/Videos.js");
const multer = require("multer");
const path = require("path");
const Profesores = require("../models/Profesores.js");

// Multer storage: save into frontend assets/Videos (must exist)
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "..", "nebriacademy-frontend", "src", "assets", "Videos"),
  filename: (req, file, cb) => cb(null, path.basename(file.originalname)),
});

const upload = multer({ storage });

// Obtener todos los videos
router.get("/", (req, res) => {
  try {
    console.log("GET /videos");
    Videos.findAll().then((resultado) => {
      res.json({ "Numero de videos": resultado.length, Videos: resultado });
    });
  } catch (error) {
    console.error("Error al obtener videos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener por ID un video
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`GET /videos/${id}`);
    Videos.findAll().then((resultado) => {
      const video = resultado.find((v) => v.id === id);
      if (video) {
        res.json(video);
      } else {
        res.status(404).json({ error: "Video no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al obtener video:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear un video
router.post("/", upload.single('archivo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Campo 'archivo' es requerido (multipart/form-data)" });

    // El campo 'autor' en la tabla `videos` referencia a `profesores.id`.
    // Requerimos que el cliente envíe el `id` del profesor y que exista.
    const autor = req.body.autor ? parseInt(req.body.autor) : null;
    if (!autor || Number.isNaN(autor)) {
      return res.status(400).json({ error: "Campo 'autor' es requerido y debe ser un id de profesor" });
    }
    const profesor = await Profesores.findByPk(autor);
    if (!profesor) {
      return res.status(400).json({ error: "Profesor no encontrado para el campo 'autor'" });
    }

    const curso = req.body.curso ? parseInt(req.body.curso) : null;
    const archivo = req.file ? req.file.filename : null;
    const nombre = req.body.nombre ? String(req.body.nombre) : null;

    // Validación: nombre y archivo deben venir juntos (ambos presentes)
    if ((nombre && !archivo) || (archivo && !nombre)) {
      return res.status(400).json({ error: "El campo 'nombre' y el archivo deben proporcionarse juntos" });
    }

    if (!curso) return res.status(400).json({ error: "Campo 'curso' es requerido" });

    const nuevo = await Videos.create({ autor, curso, nombre, archivo, valoracion: 0 });
    return res.status(201).json({ id: nuevo.id, archivo, curso, autor, nombre });
  } catch (error) {
    console.error("Error al crear video:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar un video por ID (acepta multipart si se envía archivo)
router.put("/:id", upload.single('archivo'), (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`PUT /videos/${id}`);
    Videos.findAll().then((resultado) => {
      const video = resultado.find((v) => v.id === id);
      if (video) {
        if (req.file) {
          req.body.archivo = req.file.filename;
        }
        video.update(req.body).then((actualizado) => res.json(actualizado));
      } else {
        res.status(404).json({ error: "Video no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al actualizar video:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un video por ID
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /videos/${id}`);
    Videos.findAll().then((resultado) => {
      const video = resultado.find((v) => v.id === id);
      if (video) {
        video.destroy().then(() => res.json({ mensaje: "Video eliminado" }));
      } else {
        res.status(404).json({ error: "Video no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al eliminar video:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
