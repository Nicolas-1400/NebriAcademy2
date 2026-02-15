const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Apuntes = require("../models/Apuntes.js");
const Profesores = require("../models/Profesores.js");
const Usuarios = require("../models/Usuarios.js");
const Alumnos = require("../models/Alumnos.js");
const Cursos = require("../models/Cursos.js");

// --- Configuración de Uploads (Multer) ---
// Se almacenan físicamente en el frontend para ser servidos como estáticos
const uploadDir = path.join(
  __dirname,
  "../../../nebriacademy-frontend/src/assets/Apuntes",
);
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, path.basename(file.originalname)),
  }),
});

// --- Rutas ---

// GET / - Listar todos
router.get("/", async (req, res) => {
  try {
    const data = await Apuntes.findAll();
    res.json({ "Numero de apuntes": data.length, Apuntes: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /categorias - Enums de categoría
router.get("/categorias", (req, res) => {
  try {
    const vals = Apuntes.rawAttributes?.categoria?.values || [];
    res.json({ categorias: vals });
  } catch (e) {
    res.status(500).json({ categorias: [] });
  }
});

// GET /:id - Detalle
router.get("/:id", async (req, res) => {
  try {
    const apunte = await Apuntes.findByPk(req.params.id);
    apunte
      ? res.json(apunte)
      : res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /
 * Crea un apunte y asigna autor.
 * Resolución de autor: intenta usar usuarioId directo, o buscar en Alumnos/Profesores si llega un ID genérico.
 */
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido" });

    const {
      nombre,
      descripcion,
      curso: cursoId,
      usuarioId,
      autor: autorInput,
    } = req.body;
    let categoria = req.body.categoria || null;

    // 1. Resolver Autor (Usuario ID)
    let autorFinal = null;

    // Intento A: UsuarioId explícito
    if (usuarioId && !isNaN(usuarioId)) {
      if (await Usuarios.findByPk(usuarioId)) autorFinal = usuarioId;
    }

    // Intento B: Si falla A, usar 'autor' (puede ser ID de profesor/alumno o usuario)
    if (!autorFinal && autorInput) {
      if (await Usuarios.findByPk(autorInput)) {
        autorFinal = autorInput;
      } else {
        // Buscar relacionalmente
        const alumno = await Alumnos.findByPk(autorInput);
        if (alumno?.usuarioId) autorFinal = alumno.usuarioId;
        else {
          const prof = await Profesores.findByPk(autorInput);
          if (prof?.usuarioId) autorFinal = prof.usuarioId;
        }
      }
    }

    if (!autorFinal)
      return res.status(400).json({ error: "Autor no identificado" });

    // 2. Resolver Categoría (Heredar del curso si existe)
    if (cursoId) {
      const c = await Cursos.findByPk(cursoId);
      if (c?.categoria) categoria = c.categoria;
    }

    if (!cursoId && !categoria)
      return res
        .status(400)
        .json({ error: "Categoría requerida si no hay curso" });

    // 3. Crear Registro
    const nuevo = await Apuntes.create({
      autor: autorFinal,
      curso: cursoId || null,
      categoria,
      archivo: req.file.filename,
      descripcion,
      valoracion: 0,
      nombre: nombre || req.file.originalname,
    });

    res.status(201).json({ id: nuevo.id, archivo: nuevo.archivo });
  } catch (error) {
    console.error("Error subida apunte:", error);
    res.status(500).json({ error: "Error creando apunte" });
  }
});

// PUT /:id - Actualizar (Metadata o Archivo)
router.put("/:id", upload.single("archivo"), async (req, res) => {
  try {
    const apunte = await Apuntes.findByPk(req.params.id);
    if (!apunte) return res.status(404).json({ error: "No encontrado" });

    const updates = { ...req.body };
    if (req.file) updates.archivo = req.file.filename;

    const actualizado = await apunte.update(updates);
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando" });
  }
});

// DELETE /:id - Eliminar registro y archivo
router.delete("/:id", async (req, res) => {
  try {
    const apunte = await Apuntes.findByPk(req.params.id);
    if (!apunte) return res.status(404).json({ error: "No encontrado" });

    // Eliminar archivo físico
    if (apunte.archivo) {
      const filePath = path.join(uploadDir, apunte.archivo);
      fs.promises
        .unlink(filePath)
        .catch((e) =>
          console.warn("No se pudo borrar archivo físico:", e.message),
        );
    }

    await apunte.destroy();
    res.json({ mensaje: "Eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando" });
  }
});

module.exports = router;
