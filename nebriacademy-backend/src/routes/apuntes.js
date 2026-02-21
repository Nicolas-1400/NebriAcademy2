// ==========================================
// 1. IMPORTACIONES
// ==========================================
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

// ==========================================
// 2. CONFIGURACIÓN DE MULTIMEDIA (MULTER)
// ==========================================
// Determina el directorio uniendo variables absolutas locales con path.
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

// ==========================================
// 3. OBTENCIÓN DE DATOS (GET)
// ==========================================
// Devuelve lista total usando findAll().
router.get("/", async (req, res) => {
  try {
    // Retorna todos los registros obtenidos.
    const data = await Apuntes.findAll();
    // Devuelve un objeto JSON contando el tamaño del conteo.
    res.json({ "Numero de apuntes": data.length, Apuntes: data });
  } catch (error) {
    // Emite error de servidor por la consola.
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/categorias", (req, res) => {
  try {
    const categ = Apuntes.getAttributes()?.categoria?.values || [];
    res.json({ categorias: categ });
  } catch (e) {
    res.status(500).json({ categorias: [] });
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Consulta registro puntual pasándole el número identificador.
    const apunte = await Apuntes.findByPk(req.params.id);
    // Responde con resultado si encuentra coincidencia o pasa a error común.
    apunte
      ? res.json(apunte)
      : res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 4. AGREGACIÓN CON VALIDACIÓN DE AUTOR (POST)
// ==========================================
// Recibe el fichero y levanta registro con dependencias de Multer.
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

    if (tipo === "alumno") {
      const u = await Alumnos.findByPk(profileId);
      if (u) autorFinal = u.usuarioId;
    } else if (tipo === "profesor") {
      const u = await Profesores.findByPk(profileId);
      if (u) autorFinal = u.usuarioId;
    } else if (tipo === "administrador") {
      const u = await require("../models/Administradores").findByPk(profileId);
      if (u) autorFinal = u.usuarioId;
    }

    if (!autorFinal)
      return res
        .status(400)
        .json({ error: "Autor no identificado o no encontrado" });

    if (cursoId) {
      const c = await Cursos.findByPk(cursoId);
      if (c?.categoria) categoria = c.categoria;
    }

    if (!cursoId && !categoria)
      return res
        .status(400)
        .json({ error: "Categoría requerida si no hay curso" });

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

// ==========================================
// 5. EDICIÓN DEL RECURSO (PUT)
// ==========================================
// Localiza fichero por identificador y sobreescribe atributos indicados.
router.put("/:id", upload.single("archivo"), async (req, res) => {
  try {
    // Averigua que el bloque a tratar existe primero consultando la base.
    const apunte = await Apuntes.findByPk(req.params.id);
    if (!apunte) return res.status(404).json({ error: "No encontrado" });

    // Acompaña el resto de pares de valores obtenidos de req.body.
    const updates = { ...req.body };
    // Refuerza detectando si ha ingresado nuevo componente físico de Multer.
    if (req.file) updates.archivo = req.file.filename;

    // Emplea el agrupamiento para incitar actualización en MySQL.
    const actualizado = await apunte.update(updates);
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando" });
  }
});

// ==========================================
// 6. ELIMINACIÓN FÍSICA Y DE REGISTRO (DELETE)
// ==========================================
// Deshace rastro de documento a nivel de tablas relacionales y directorios.
router.delete("/:id", async (req, res) => {
  try {
    // Asegura tener fila real llamando a la columna inicial.
    const apunte = await Apuntes.findByPk(req.params.id);
    if (!apunte) return res.status(404).json({ error: "No encontrado" });

    // Ubica el fichero físico y asincronamente lo deshace pasándole ignore en .catch.
    if (apunte.archivo) {
      const filePath = path.join(uploadDir, apunte.archivo);
      fs.promises
        .unlink(filePath)
        .catch((e) =>
          console.warn("No se pudo borrar archivo físico:", e.message),
        );
    }

    // Ejecuta el vaciado del registro lanzando directriz destroy de ORM.
    await apunte.destroy();
    res.json({ mensaje: "Eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando" });
  }
});

// ==========================================
// 7. EXPORTACIONES
// ==========================================
module.exports = router;
