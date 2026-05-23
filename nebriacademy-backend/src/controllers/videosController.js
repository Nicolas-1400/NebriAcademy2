// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const cloudinary = require("../routes/cloudinary");
const { uploadToCloudinary, extractPublicId, getResourceTypeFromUrl } = require("../utils/cloudinaryHelper");
const Videos = require("../models/Videos.js");
const Profesores = require("../models/Profesores.js");
const Alumnos = require("../models/Alumnos.js");
const Cursos = require("../models/Cursos.js");
const CursosAlumnos = require("../models/CursosAlumnos.js");
const Notificaciones = require("../models/Notificaciones.js");

// ── CONTROLADOR: videos ─────────────────────────────────────────────────────
// Gestión de vídeos: subida, actualización, borrado y notificaciones a alumnos
// Helpers compartidos importados desde ../utils/cloudinaryHelper

// Listar todos los vídeos
exports.listAll = async (req, res) => {
  try {
    const all = await Videos.findAll();
    res.json({ "Numero de videos": all.length, Videos: all });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Obtener vídeo por id
exports.getById = async (req, res) => {
  try {
    const v = await Videos.findByPk(req.params.id);
    v ? res.json(v) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Subir nuevo vídeo (Cloudinary) y notificar alumnos apuntados
exports.create = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido" });
    const { nombre, curso, profileId, tipo } = req.body;
    if (!nombre || !curso || !profileId || !tipo) return res.status(400).json({ error: "Datos incompletos" });

    let profesorId = null;
    if (tipo === "profesor") {
      const p = await Profesores.findByPk(profileId);
      if (p) profesorId = p.id;
    }

    if (!profesorId) return res.status(400).json({ error: "Profesor no identificado o no autorizado" });

    // Subir vídeo a Cloudinary (resource_type video) y almacenar la URL
    const baseName = req.file.originalname.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "_");
    const cloudResult = await uploadToCloudinary(req.file.buffer, { folder: "nebriacademy/videos", resource_type: "video", public_id: baseName });

    const nuevo = await Videos.create({ autor: profesorId, curso, nombre, archivo: cloudResult.secure_url, valoracion: 0 });

    try {
      if (curso) {
        const c = await Cursos.findByPk(curso);
        const apuntados = await CursosAlumnos.findAll({ where: { cursoId: curso, apuntado: true } });
        const notificaciones = [];
        for (const ap of apuntados) {
          const al = await Alumnos.findByPk(ap.alumnoId);
          if (al) {
            notificaciones.push({ usuarioId: al.usuarioId, tipoUsuario: "alumno", mensaje: `Nuevo vídeo subido en el curso ${c ? c.nombreCurso : 'seleccionado'}`, enlace: `/Home/Courses/${curso}` });
          }
        }
        if (notificaciones.length > 0) await Notificaciones.bulkCreate(notificaciones);
      }
    } catch (errNoti) {
      console.error("Error creando notificaciones (videos):", errNoti);
    }

    res.status(201).json({ id: nuevo.id, archivo: nuevo.archivo });
  } catch (e) {
    console.error("Error creando video:", e);
    res.status(500).json({ error: "Error creando video" });
  }
};

// Actualizar vídeo y reemplazar archivo en Cloudinary si se envía
exports.update = async (req, res) => {
  try {
    const v = await Videos.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: "No encontrado" });

    const updates = { ...req.body };
    // Si se reemplaza el archivo del vídeo, borrar el asset anterior en Cloudinary (si procede)
    if (req.file) {
      if (v.archivo && v.archivo.includes("cloudinary.com")) {
        try {
          const pid = extractPublicId(v.archivo, "video");
          if (pid) await cloudinary.uploader.destroy(pid, { resource_type: "video" });
        } catch (e) {
          console.warn("No se pudo borrar video anterior de Cloudinary:", e.message);
        }
      }
      const baseName = req.file.originalname.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "_");
      const cloudResult = await uploadToCloudinary(req.file.buffer, { folder: "nebriacademy/videos", resource_type: "video", public_id: baseName });
      updates.archivo = cloudResult.secure_url;
    }

    const updated = await v.update(updates);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Eliminar vídeo, limpiar Cloudinary y notificar afectados
exports.remove = async (req, res) => {
  try {
    const v = await Videos.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: "No encontrado" });

    // Al borrar un vídeo, también eliminamos el asset en Cloudinary cuando sea posible
    if (v.archivo && v.archivo.includes("cloudinary.com")) {
      try {
        const pid = extractPublicId(v.archivo, "video");
        if (pid) await cloudinary.uploader.destroy(pid, { resource_type: "video" });
      } catch (e) {
        console.warn("No se pudo borrar video de Cloudinary:", e.message);
      }
    }

    const { reason } = req.query;
    if (reason) {
      try {
        const CursosAlumnos = require("../models/CursosAlumnos.js");
        const Alumnos = require("../models/Alumnos.js");

        if (v.autor) {
          const prof = await Profesores.findByPk(v.autor);
          if (prof && prof.usuarioId) {
            await Notificaciones.create({ usuarioId: prof.usuarioId, tipoUsuario: "profesor", mensaje: `Tu vídeo "${v.nombre}" ha sido eliminado. Razón: ${reason}`, fecha: new Date() });
          }
        }

        if (v.curso) {
          const matriculados = await CursosAlumnos.findAll({ where: { cursoId: v.curso, apuntado: true } });
          for (const m of matriculados) {
            const al = await Alumnos.findByPk(m.alumnoId);
            if (al && al.usuarioId) {
              await Notificaciones.create({ usuarioId: al.usuarioId, tipoUsuario: "alumno", mensaje: `Se ha eliminado un vídeo ("${v.nombre}") del curso en el que estás inscrito. Razón: ${reason}`, fecha: new Date() });
            }
          }
        }
      } catch (errNotif) {
        console.warn("Error enviando notificaciones de borrado (video):", errNotif.message);
      }
    }

    await v.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};
