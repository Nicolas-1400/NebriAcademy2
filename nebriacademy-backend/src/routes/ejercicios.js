const express = require("express");
const router = express.Router();
const Ejercicios = require("../models/Ejercicios.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Profesores = require("../models/Profesores.js");
const Usuarios = require("../models/Usuarios.js");

// Multer: guarda en la carpeta de assets del frontend (Ejercicios)
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "..", "nebriacademy-frontend", "src", "assets", "Ejercicios"),
  filename: (req, file, cb) => {
    // Guardar con el nombre original, manteniendo la extensión
    cb(null, path.basename(file.originalname));
  },
});

const upload = multer({ storage });

// Obtener todos los ejercicios
router.get("/", (req, res) => {
  try {
    Ejercicios.findAll().then((resultado) => {
      res.json({
        "Numero de ejercicios": resultado.length,
        Ejercicios: resultado,
      });
    });
  } catch (error) {
    console.error("Error al obtener ejercicios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener por ID un ejercicio
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    Ejercicios.findAll().then((resultado) => {
      const ejercicio = resultado.find((e) => e.id === id);
      if (ejercicio) {
        res.json(ejercicio);
      } else {
        res.status(404).json({ error: "Ejercicio no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al obtener ejercicio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear un ejercicio (subida de archivo)
router.post("/", upload.single('archivo'), async (req, res) => {
  try {
    const autorInput = req.body.autor ? parseInt(req.body.autor) : null;
    const usuarioIdInput = req.body.usuarioId ? parseInt(req.body.usuarioId) : null;
    const curso = req.body.curso ? parseInt(req.body.curso) : null;
    const descripcion = req.body.descripcion || null;
    const nombre = req.body.nombre || null;
    if (!autorInput || Number.isNaN(autorInput)) {
      return res.status(400).json({ error: "Campo 'autor' es requerido y debe ser un id numérico" });
    }
    // Requerimos archivo; si no llega, devolvemos 400
    if (!req.file) {
      return res.status(400).json({ error: "Campo 'archivo' es requerido (multipart/form-data)" });
    }
    const archivo = req.file.filename;

    if (!nombre || String(nombre).trim() === '') {
      return res.status(400).json({ error: "Campo 'nombre' es requerido para ejercicios" });
    }

    // Mapear el autor recibido al id de Profesor que espera la tabla Ejercicios
    let profesorId = null;
    // Preferir `usuarioId` enviado por el frontend cuando esté disponible
    if (usuarioIdInput && !Number.isNaN(usuarioIdInput)) {
      const profByUsuarioId = await Profesores.findOne({ where: { usuarioId: usuarioIdInput } });
      if (profByUsuarioId) profesorId = profByUsuarioId.id;
    }

    // Si no se resolvió por usuarioId, intentar con autorInput interpretándolo como profesor.id
    if (!profesorId && autorInput && !Number.isNaN(autorInput)) {
      const profById = await Profesores.findByPk(autorInput);
      if (profById) profesorId = profById.id;
      else {
        // intentar interpretar autorInput como usuario.id apuntando a profesor.usuarioId
        const profByUsuario = await Profesores.findOne({ where: { usuarioId: autorInput } });
        if (profByUsuario) profesorId = profByUsuario.id;
      }
    }

    if (!profesorId) {
      return res.status(400).json({ error: "No se pudo mapear el 'autor' a un profesor válido" });
    }

    const nuevo = await Ejercicios.create({ autor: profesorId, curso, descripcion, archivo, nombre });
    return res.status(201).json({ id: nuevo.id, archivo });
  } catch (error) {
    console.error("Error al crear ejercicio:", error && error.stack ? error.stack : error);
    return res.status(500).json({ error: error && error.message ? error.message : "Error interno del servidor" });
  }
});

// Actualizar un ejercicio por ID (acepta multipart si se envía archivo)
router.put("/:id", upload.single('archivo'), (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    Ejercicios.findAll().then((resultado) => {
      const ejercicio = resultado.find((e) => e.id === id);
      if (ejercicio) {
        if (req.file) {
          req.body.archivo = req.file.filename;
        }
        // Ensure nombre is not empty if provided
        if (req.body.nombre && String(req.body.nombre).trim() === '') {
          return res.status(400).json({ error: "Campo 'nombre' no puede estar vacío" });
        }
        ejercicio.update(req.body).then((actualizado) => res.json(actualizado));
      } else {
        res.status(404).json({ error: "Ejercicio no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al actualizar ejercicio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un ejercicio por ID
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const ejercicio = await Ejercicios.findByPk(id);
    if (!ejercicio) return res.status(404).json({ error: "Ejercicio no encontrado" });

    await ejercicio.destroy();

    if (ejercicio.archivo) {
      try {
        const filePath = path.join(__dirname, "..", "..", "..", "nebriacademy-frontend", "src", "assets", "Ejercicios", ejercicio.archivo);
        await fs.promises.unlink(filePath);
        console.log(`Archivo borrado: ${filePath}`);
      } catch (fsErr) {
        if (fsErr && fsErr.code === 'ENOENT') {
          console.warn('Archivo no encontrado al intentar borrar ejercicio:', ejercicio.archivo);
        } else {
          console.error('Error borrando archivo local de ejercicio:', fsErr);
        }
      }
    }

    return res.json({ mensaje: "Ejercicio eliminado" });
  } catch (error) {
    console.error("Error al eliminar ejercicio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
