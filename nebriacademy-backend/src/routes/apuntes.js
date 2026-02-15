const express = require("express");
const router = express.Router();
const Apuntes = require("../models/Apuntes.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Profesores = require("../models/Profesores.js");
const Usuarios = require("../models/Usuarios.js");
const Alumnos = require("../models/Alumnos.js");
const Cursos = require("../models/Cursos.js");

// Multer: guarda en la carpeta de assets del frontend
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "..", "nebriacademy-frontend", "src", "assets", "Apuntes"),
  filename: (req, file, cb) => {
    // Guardar con el nombre original del archivo
    cb(null, path.basename(file.originalname));
  },
});

const upload = multer({ storage });

// Obtener todos los apuntes (incluye valores del enum 'categoria' de Apuntes)
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

// Endpoint simple para devolver valores del enum 'categoria' de Apuntes
router.get('/categorias', (req, res) => {
  try {
    const vals = (Apuntes.rawAttributes && Apuntes.rawAttributes.categoria && Apuntes.rawAttributes.categoria.values) || [];
    res.json({ categorias: vals });
  } catch (e) {
    console.error('Error devolviendo categorias Apuntes:', e);
    res.status(500).json({ categorias: [] });
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
    const curso = req.body.curso ? parseInt(req.body.curso) : null;
    const nombre = req.body.nombre || null;

    // Resolver autor de forma segura: apuntes.autor referencia a usuarios.id
    const autorInput = req.body.autor ? parseInt(req.body.autor) : null;
    const usuarioIdInput = req.body.usuarioId ? parseInt(req.body.usuarioId) : null;

    let autor = null;
    // Priorizar `usuarioId` enviado por frontend cuando exista y sea válido
    if (usuarioIdInput && !Number.isNaN(usuarioIdInput)) {
      const uBy = await Usuarios.findByPk(usuarioIdInput);
      if (uBy) autor = usuarioIdInput;
    }

    // Si no hemos resuelto, usar el flujo anterior con `autorInput`
    if (!autor) {
      if (!autorInput || Number.isNaN(autorInput)) {
        return res.status(400).json({ error: "Campo 'autor' es requerido y debe ser un id numérico" });
      }

      // Si autorInput corresponde a un usuario ya (usuarios.id)
      const u = await Usuarios.findByPk(autorInput);
      if (u) {
        autor = autorInput;
      } else {
        // Si es id de alumno o profesor, mapear a su usuarioId
        const a = await Alumnos.findByPk(autorInput);
        if (a && a.usuarioId) {
          autor = a.usuarioId;
        } else {
          const p = await Profesores.findByPk(autorInput);
          if (p && p.usuarioId) {
            autor = p.usuarioId;
          }
        }
      }
    }

    if (!autor) return res.status(400).json({ error: "No se pudo resolver el campo 'autor'" });
    // Requerimos archivo; si no llega, devolvemos 400
    if (!req.file) {
      return res.status(400).json({ error: "Campo 'archivo' es requerido (multipart/form-data)" });
    }
    const archivo = req.file.filename;
    const descripcion = req.body.descripcion || null;
    // categoria puede venir en body si se sube desde la página Apuntes
    let categoria = req.body.categoria || null;

    if (!nombre || String(nombre).trim() === '') {
      return res.status(400).json({ error: "Campo 'nombre' es requerido para apuntes" });
    }

    // Si viene curso, obtener la categoria del curso y sobreescribir
    if (curso) {
      const cursoDb = await Cursos.findByPk(curso);
      if (cursoDb && cursoDb.categoria) {
        categoria = cursoDb.categoria;
      }
    }

    // Si no hay curso, requerimos que se indique categoria
    if (!curso && !categoria) {
      return res.status(400).json({ error: "Campo 'categoria' es requerido cuando no se sube desde un curso" });
    }

    const nuevo = await Apuntes.create({ autor, curso, categoria, archivo, descripcion, valoracion: 0, nombre });
    return res.status(201).json({ id: nuevo.id, archivo });
  } catch (error) {
    console.error("Error al crear apunte:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar un apunte por ID (acepta multipart si se envía archivo)
router.put("/:id", upload.single('archivo'), (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`PUT /apuntes/${id}`);
    Apuntes.findAll().then((resultado) => {
      const apunte = resultado.find((a) => a.id === id);
      if (apunte) {
        if (req.file) {
          req.body.archivo = req.file.filename;
        }
        if (req.body.nombre && String(req.body.nombre).trim() === '') {
          return res.status(400).json({ error: "Campo 'nombre' no puede estar vacío" });
        }
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
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /apuntes/${id}`);

    const apunte = await Apuntes.findByPk(id);
    if (!apunte) return res.status(404).json({ error: "Apunte no encontrado" });

    await apunte.destroy();

    if (apunte.archivo) {
      try {
        const filePath = path.join(__dirname, "..", "..", "..", "nebriacademy-frontend", "src", "assets", "Apuntes", apunte.archivo);
        await fs.promises.unlink(filePath);
        console.log(`Archivo borrado: ${filePath}`);
      } catch (fsErr) {
        if (fsErr && fsErr.code === 'ENOENT') {
          console.warn('Archivo no encontrado al intentar borrar:', apunte.archivo);
        } else {
          console.error('Error borrando archivo local:', fsErr);
        }
      }
    }

    return res.json({ mensaje: "Apunte eliminado" });
  } catch (error) {
    console.error("Error al eliminar apunte:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


module.exports = router;
