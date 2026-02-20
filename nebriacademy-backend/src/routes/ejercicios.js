// ==========================================
// 1. IMPORTACIONES
// ==========================================
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Ejercicios = require("../models/Ejercicios.js");
const Profesores = require("../models/Profesores.js");

// ==========================================
// 2. CONFIGURACIÓN DE SUBIDA DE ARCHIVOS
// ==========================================
// Configura la ruta absoluta e instancia el guardado local del fichero usando multer.
const uploadDir = path.join(
  __dirname,
  "../../../nebriacademy-frontend/src/assets/Ejercicios",
);
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, path.basename(file.originalname)),
  }),
});

// ==========================================
// 3. RUTAS DE OBTENCIÓN (GET)
// ==========================================
// Usa findAll para la lectura genérica o busca mediante ID único individual.
router.get("/", async (req, res) => {
  try {
    // Llama a la base de datos solicitando en cadena todas las filas.
    const all = await Ejercicios.findAll();
    // Retorna el dato crudo pasándolo por res.json.
    res.json({ "Numero de ejercicios": all.length, Ejercicios: all });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Rastrea el ID específico a través de findByPk.
    const ej = await Ejercicios.findByPk(req.params.id);
    // Evalúa que la petición contenga valor para imprimir 200 o saltar 404.
    ej ? res.json(ej) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 4. RUTAS DE CREACIÓN (POST)
// ==========================================
// Asigna a un autor instanciando dependencias para inyectarlo mediante create.
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido" });
    const { nombre, descripcion, curso, profileId, tipo } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });
    if (!profileId || !tipo)
      return res.status(400).json({ error: "Faltan datos de autor" });

    let profesorId = null;

    if (tipo === "profesor") {
      const prof = await Profesores.findByPk(profileId);
      if (prof) profesorId = prof.id;
    } else if (tipo === "administrador") {
      const admin = await require("../models/Administradores").findByPk(
        profileId,
      );
      if (admin && admin.usuarioId) {
        const p = await Profesores.findOne({
          where: { usuarioId: admin.usuarioId },
        });
        if (p) profesorId = p.id;
      }
    }

    if (!profesorId)
      return res
        .status(400)
        .json({ error: "Profesor no identificado o no autorizado" });

    const nuevo = await Ejercicios.create({
      autor: profesorId,
      curso: curso || null,
      descripcion: descripcion || null,
      archivo: req.file.filename,
      nombre,
    });

    res.status(201).json({ id: nuevo.id, archivo: nuevo.archivo });
  } catch (error) {
    console.error("Error creando ejercicio:", error);
    res.status(500).json({ error: "Error creando ejercicio" });
  }
});

// ==========================================
// 5. RUTAS DE ACTUALIZACIÓN (PUT)
// ==========================================
// Busca a través del ID e inyecta las variaciones extraídas del req.body.
router.put("/:id", upload.single("archivo"), async (req, res) => {
  try {
    // Busca la entidad por req.params identificando su posición en SQL.
    const ej = await Ejercicios.findByPk(req.params.id);
    if (!ej) return res.status(404).json({ error: "No encontrado" });

    // Desestructura req.body y lo empaqueta.
    const updates = { ...req.body };
    // Adhiere el nombre formateado que extrae de multer.
    if (req.file) updates.archivo = req.file.filename;

    // Ejecuta update actualizando los campos modificados.
    const updated = await ej.update(updates);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 6. RUTAS DE ELIMINACIÓN (DELETE)
// ==========================================
// Destruye fila y archivo simultáneamente pasando a eliminar el PDF en disco.
router.delete("/:id", async (req, res) => {
  try {
    // Busca y asegura la lectura positiva pasándole la id parametrizada.
    const ej = await Ejercicios.findByPk(req.params.id);
    if (!ej) return res.status(404).json({ error: "No encontrado" });

    // Ubica el fichero físico y utiliza unlink ignorando devoluciones null.
    if (ej.archivo) {
      const p = path.join(uploadDir, ej.archivo);
      fs.promises.unlink(p).catch(() => {});
    }

    // Despeja el modelo SQL llamando finalmente a destroy().
    await ej.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 7. EXPORTACIONES
// ==========================================
module.exports = router;
