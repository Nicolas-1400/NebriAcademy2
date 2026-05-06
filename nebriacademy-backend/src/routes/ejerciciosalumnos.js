// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const multer = require("multer");
const streamifier = require("streamifier");

const cloudinary = require("./cloudinary");
const EjerciciosAlumnos = require("../models/EjerciciosAlumnos");
const Ejercicios = require("../models/Ejercicios");
const Alumnos = require("../models/Alumnos");
const Profesores = require("../models/Profesores");
const ProfesoresCursos = require("../models/ProfesoresCursos");
const Notificaciones = require("../models/Notificaciones");

// ── CONFIGURACIÓN (multer) ──────────────────────────────────────────────────
const upload = multer({ storage: multer.memoryStorage() });

// ── HELPER ──────────────────────────────────────────────────────────────────
function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_chunked_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

function extractPublicId(url, resourceType) {
  try {
    const parts = url.split('/');
    const uploadIdx = parts.indexOf('upload');
    const afterUpload = parts.slice(uploadIdx + 2);
    const publicIdWithExt = afterUpload.join('/');
    return resourceType === 'raw' ? publicIdWithExt : publicIdWithExt.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}

// Extrae el resource_type real de la URL de Cloudinary para borrados correctos
function getResourceTypeFromUrl(url) {
  if (url.includes('/image/upload/')) return 'image';
  if (url.includes('/video/upload/')) return 'video';
  return 'raw';
}

// ── GET ─────────────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const all = await EjerciciosAlumnos.findAll();
    res.json({ "Numero de registros": all.length, registros: all });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const r = await EjerciciosAlumnos.findByPk(req.params.id);
    r ? res.json(r) : res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST ────────────────────────────────────────────────────────────────────
router.post("/", upload.single("archivo"), async (req, res) => {
  try {
    const { ejercicioId, profileId } = req.body;

    const validEjercicio = await Ejercicios.findByPk(ejercicioId);
    const validAlumno = await Alumnos.findByPk(profileId);

    if (!validEjercicio || !validAlumno) {
      return res.status(400).json({ error: "Ejercicio o Alumno inválido" });
    }

    let archivoUrl = null;

    if (req.file) {
      const baseName = req.file.originalname
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-zA-Z0-9._-]/g, "_");
      const cloudResult = await uploadToCloudinary(req.file.buffer, {
        folder: "nebriacademy/ejerciciosalumnos",
        resource_type: "auto",
        public_id: baseName,
      });
      archivoUrl = cloudResult.secure_url;
    }

    const nuevo = await EjerciciosAlumnos.create({
      ejercicioId,
      alumnoId: profileId,
      archivo: archivoUrl,
    });

    // --- NOTIFICACIONES ---
    try {
      if (validEjercicio.curso) {
        const arrProfesores = await ProfesoresCursos.findAll({ where: { cursoId: validEjercicio.curso } });
        const notificaciones = [];
        for (const pc of arrProfesores) {
          const p = await Profesores.findByPk(pc.profesorId);
          if (p) {
            notificaciones.push({
              usuarioId: p.usuarioId,
              tipoUsuario: "profesor",
              mensaje: `El alumno ${validAlumno.nombre} ha subido una respuesta al ejercicio ${validEjercicio.nombre}`,
              enlace: `/Home/Courses/${validEjercicio.curso}/GradeExercises/${ejercicioId}`
            });
          }
        }
        if (notificaciones.length > 0) await Notificaciones.bulkCreate(notificaciones);
      }
    } catch (errNoti) {
      console.error("Error creando notificaciones (ejerciciosalumnos):", errNoti);
    }

    res.status(201).json({ id: nuevo.id, archivo: nuevo.archivo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// ── PUT ─────────────────────────────────────────────────────────────────────
router.put("/:id", upload.single("archivo"), async (req, res) => {
  try {
    const r = await EjerciciosAlumnos.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "No encontrado" });

    const updates = { ...req.body };

    if (req.file) {
      if (r.archivo && r.archivo.includes('cloudinary.com')) {
        try {
          const resourceType = getResourceTypeFromUrl(r.archivo);
          const pid = extractPublicId(r.archivo, resourceType);
          if (pid) await cloudinary.uploader.destroy(pid, { resource_type: resourceType });
        } catch (e) {
          console.warn('No se pudo borrar entrega anterior de Cloudinary:', e.message);
        }
      }
      const baseName = req.file.originalname
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-zA-Z0-9._-]/g, "_");
      const cloudResult = await uploadToCloudinary(req.file.buffer, {
        folder: "nebriacademy/ejerciciosalumnos",
        resource_type: "auto",
        public_id: baseName,
      });
      updates.archivo = cloudResult.secure_url;
    }

    const updated = await r.update(updates);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── DELETE ──────────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const r = await EjerciciosAlumnos.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "No encontrado" });

    if (r.archivo && r.archivo.includes('cloudinary.com')) {
      try {
        const resourceType = getResourceTypeFromUrl(r.archivo);
        const pid = extractPublicId(r.archivo, resourceType);
        if (pid) await cloudinary.uploader.destroy(pid, { resource_type: resourceType });
      } catch (e) {
        console.warn('No se pudo borrar entrega de Cloudinary:', e.message);
      }
    }

    await r.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
