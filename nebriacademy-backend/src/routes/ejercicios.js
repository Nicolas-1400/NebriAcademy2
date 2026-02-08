const express = require("express");
const router = express.Router();
const Ejercicios = require("../models/Ejercicios.js");
const multer = require("multer");
const path = require("path");
const Profesores = require("../models/Profesores.js");
const Usuarios = require("../models/Usuarios.js");

// Multer: guarda en la carpeta de assets del frontend (Ejercicios)
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "..", "nebriacademy-frontend", "src", "assets", "Ejercicios"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Obtener todos los ejercicios
router.get("/", (req, res) => {
  try {
    console.log("GET /ejercicios");
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
    console.log(`GET /ejercicios/${id}`);
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
    let autorInput = req.body.autor ? parseInt(req.body.autor) : null;
    const curso = req.body.curso ? parseInt(req.body.curso) : null;
    const descripcion = req.body.descripcion || null;
    const nombre = req.body.nombre || null;

    // Requerimos archivo; si no llega, devolvemos 400
    if (!req.file) {
      return res.status(400).json({ error: "Campo 'archivo' es requerido (multipart/form-data)" });
    }
    const archivo = req.file.filename;

    if (!nombre || String(nombre).trim() === '') {
      return res.status(400).json({ error: "Campo 'nombre' es requerido para ejercicios" });
    }

    // Resolver autor de forma análoga a apuntes: puede ser id de usuario o id de profesor
    let autor = null;
    if (autorInput) {
      const u = await Usuarios.findByPk(autorInput);
      if (u) {
        autor = autorInput;
      } else {
        const p = await Profesores.findByPk(autorInput);
        if (p && p.usuarioId) {
          autor = p.usuarioId;
        }
      }
    }

    const nuevo = await Ejercicios.create({ autor, curso, descripcion, archivo, nombre });

    return res.status(201).json({ id: nuevo.id, archivo });
  } catch (error) {
    console.error("Error al crear ejercicio:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar un ejercicio por ID (acepta multipart si se envía archivo)
router.put("/:id", upload.single('archivo'), (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`PUT /ejercicios/${id}`);
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
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /ejercicios/${id}`);
    Ejercicios.findAll().then((resultado) => {
      const ejercicio = resultado.find((e) => e.id === id);
      if (ejercicio) {
        ejercicio
          .destroy()
          .then(() => res.json({ mensaje: "Ejercicio eliminado" }));
      } else {
        res.status(404).json({ error: "Ejercicio no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al eliminar ejercicio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
