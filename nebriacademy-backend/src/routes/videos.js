// ==========================================
// 1. IMPORTACIONES
// ==========================================
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Videos = require("../models/Videos.js");
const Profesores = require("../models/Profesores.js");

// ==========================================
// 2. LÓGICA DE SUBIDA (MULTER)
// ==========================================
// Instancia destination uniendo el root hasta la carpeta de assets para multer.
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

// ==========================================
// 3. LECTURA (GET)
// ==========================================
// Retorna todos los registros de manera desglosada con un findAll.
router.get("/", async (req, res) => {
  try {
    // Lee pasivamente con un findAll en Videos.
    const all = await Videos.findAll();
    // Construye un response conteniendo numéricamente el grupo de entidades.
    res.json({ "Numero de videos": all.length, Videos: all });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Extrae usando param id a la base de MySQL.
    const v = await Videos.findByPk(req.params.id);
    // Pasa los datos extraídos caso contrario indica código 404 ausente.
    v ? res.json(v) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 4. ALTA DEL VIDEO (POST)
// ==========================================
// Recibe variables y parsea strings inyectando video por medio de local save multer.
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

// ==========================================
// 5. ACTUALIZACIÓN SECUNDARIA (PUT)
// ==========================================
// Reescribe por update basándose en la petición PUT con multipart de multer.
router.put("/:id", upload.single("archivo"), async (req, res) => {
  try {
    // Identifica la row localizadora mediante findByPk.
    const v = await Videos.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: "No encontrado" });

    // Une el cuerpo general extraído del req sin sus partes binarias.
    const updates = { ...req.body };
    // Modifica o asimila el archivo según detecte inyección nueva o nula.
    if (req.file) updates.archivo = req.file.filename;

    // Usa update procesando y modificando los valores.
    const updated = await v.update(updates);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 6. BORRADO Y PURGA FÍSICA (DELETE)
// ==========================================
// Localiza y aniquila tanto el elemento textual de tabla como su archivo de soporte físico.
router.delete("/:id", async (req, res) => {
  try {
    // Encuentra validando la fila de modelo.
    const v = await Videos.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: "No encontrado" });

    // Genera un file check asíncrono pasándole unlink sin parar el proceso root.
    if (v.archivo) {
      const p = path.join(uploadDir, v.archivo);
      fs.promises.unlink(p).catch(() => {});
    }

    // Desempeña el script final enviándole destroy() al array extraído.
    await v.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 7. EXPORTACIONES
// ==========================================
module.exports = router;
