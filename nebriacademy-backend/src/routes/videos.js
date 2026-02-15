const express = require("express");
const router = express.Router();
const Videos = require("../models/Videos.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
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

    const autorInput = req.body.autor ? parseInt(req.body.autor) : null;
    const usuarioIdInput = req.body.usuarioId ? parseInt(req.body.usuarioId) : null;

    const curso = req.body.curso ? parseInt(req.body.curso) : null;
    const archivo = req.file ? req.file.filename : null;
    const nombre = req.body.nombre ? String(req.body.nombre) : null;

    // Validación: nombre y archivo deben venir juntos (ambos presentes)
    if ((nombre && !archivo) || (archivo && !nombre)) {
      return res.status(400).json({ error: "El campo 'nombre' y el archivo deben proporcionarse juntos" });
    }

    if (!curso) return res.status(400).json({ error: "Campo 'curso' es requerido" });

    // Resolver autor -> profesor.id
    let profesorId = null;
    if (usuarioIdInput && !Number.isNaN(usuarioIdInput)) {
      const p = await Profesores.findOne({ where: { usuarioId: usuarioIdInput } });
      if (p) profesorId = p.id;
    }
    if (!profesorId && autorInput && !Number.isNaN(autorInput)) {
      const pById = await Profesores.findByPk(autorInput);
      if (pById) profesorId = pById.id;
      else {
        const pByUsuario = await Profesores.findOne({ where: { usuarioId: autorInput } });
        if (pByUsuario) profesorId = pByUsuario.id;
      }
    }
    if (!profesorId) return res.status(400).json({ error: "No se pudo mapear el 'autor' a un profesor válido" });

    const nuevo = await Videos.create({ autor: profesorId, curso, nombre, archivo, valoracion: 0 });
    return res.status(201).json({ id: nuevo.id, archivo, curso, autor: profesorId, nombre });
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
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /videos/${id}`);

    const video = await Videos.findByPk(id);
    if (!video) return res.status(404).json({ error: "Video no encontrado" });

    await video.destroy();

    if (video.archivo) {
      try {
        const filePath = path.join(__dirname, "..", "..", "..", "nebriacademy-frontend", "src", "assets", "Videos", video.archivo);
        await fs.promises.unlink(filePath);
        console.log(`Archivo borrado: ${filePath}`);
      } catch (fsErr) {
        if (fsErr && fsErr.code === 'ENOENT') {
          console.warn('Archivo no encontrado al intentar borrar video:', video.archivo);
        } else {
          console.error('Error borrando archivo local de video:', fsErr);
        }
      }
    }

    return res.json({ mensaje: "Video eliminado" });
  } catch (error) {
    console.error("Error al eliminar video:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
