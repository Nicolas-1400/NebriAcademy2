// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Apuntes = require("../models/Apuntes.js");
const Profesores = require("../models/Profesores.js");
const Alumnos = require("../models/Alumnos.js");
const Cursos = require("../models/Cursos.js");

// ── CONFIGURACIÓN (multer) ──────────────────────────────────────────────────
// Carpeta donde se guardan localmente los archivos de apuntes subidos
const uploadDir = path.join(
  __dirname,
  "../../../nebriacademy-frontend/src/assets/Apuntes",
);

// Configuramos multer para que guarde el archivo en uploadDir conservando el nombre original
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, path.basename(file.originalname)),
  }),
});

// ── GET ─────────────────────────────────────────────────────────────────────
// GET /apuntes — Devuelve todos los apuntes registrados
router.get("/", async (req, res) => {
  try {
    const data = await Apuntes.findAll();
    res.json({ "Numero de apuntes": data.length, Apuntes: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /apuntes/categorias — Devuelve los valores del ENUM de categorias definidos en el modelo
router.get("/categorias", (req, res) => {
  try {
    const categ = Apuntes.getAttributes()?.categoria?.values || [];
    res.json({ categorias: categ });
  } catch (e) {
    res.status(500).json({ categorias: [] });
  }
});

// GET /apuntes/:id — Devuelve un apunte concreto por su ID
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

// ── POST ────────────────────────────────────────────────────────────────────
// POST /apuntes — Sube un nuevo apunte. Requiere un archivo adjunto (PDF u otro).
// Detecta si quien sube es alumno o profesor para asignar el autor correcto.
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido" });

    const {
      nombre,
      descripcion,
      curso: cursoId,
      profileId,
      tipo,
      categoria: categoriaInput,
    } = req.body;
    let categoria = categoriaInput || null;

    let autorFinal = null;

    // Según el tipo de usuario, buscamos su usuarioId para usarlo como autor del apunte
    if (tipo === "alumno") {
      const u = await Alumnos.findByPk(profileId);
      if (u) autorFinal = u.usuarioId;
    } else if (tipo === "profesor") {
      const u = await Profesores.findByPk(profileId);
      if (u) autorFinal = u.usuarioId;
    }

    if (!autorFinal)
      return res
        .status(400)
        .json({ error: "Autor no identificado o no encontrado" });

    // Si el apunte está asociado a un curso, heredamos la categoría de ese curso
    if (cursoId) {
      const c = await Cursos.findByPk(cursoId);
      if (c?.categoria) categoria = c.categoria;
    }

    if (!cursoId && !categoria)
      return res
        .status(400)
        .json({ error: "Categoría requerida si no hay curso" });

    // Creamos el registro del apunte en la BDD con el archivo ya guardado en disco
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

// ── PUT ─────────────────────────────────────────────────────────────────────
// PUT /apuntes/:id — Actualiza los datos de un apunte. Si se adjunta un archivo nuevo, también se actualiza
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

// ── DELETE ──────────────────────────────────────────────────────────────────
// DELETE /apuntes/:id — Elimina el apunte de la BDD y borra también el archivo físico del disco
router.delete("/:id", async (req, res) => {
  try {
    const apunte = await Apuntes.findByPk(req.params.id);
    if (!apunte) return res.status(404).json({ error: "No encontrado" });

    // Intentamos borrar el fichero del disco; si no existe, ignoramos el error
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

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
