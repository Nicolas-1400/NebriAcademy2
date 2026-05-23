// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const Ejercicios = require("../models/Ejercicios.js");
const Profesores = require("../models/Profesores.js");
const Alumnos = require("../models/Alumnos.js");
const Cursos = require("../models/Cursos.js");
const CursosAlumnos = require("../models/CursosAlumnos.js");
const Notificaciones = require("../models/Notificaciones.js");
const cloudinary = require("../routes/cloudinary");
const { uploadToCloudinary, extractPublicId, getResourceTypeFromUrl } = require("../utils/cloudinaryHelper");

// ── CONTROLADOR: ejercicios ──────────────────────────────────────────────────
// Gestión de ejercicios: subida/edición/borrado y notificaciones a alumnos

// Listar todos los ejercicios
exports.listAll = async (req, res) => {
  try {
    const all = await Ejercicios.findAll();
    res.json({ "Numero de ejercicios": all.length, Ejercicios: all });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Obtener ejercicio por id
exports.getById = async (req, res) => {
  try {
    const ej = await Ejercicios.findByPk(req.params.id);
    ej ? res.json(ej) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Crear ejercicio (subida a Cloudinary y notificaciones)
exports.create = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido" });
    const { nombre, descripcion, curso, profileId, tipo } = req.body;
    if (!nombre) return res.status(400).json({ error: "Nombre requerido" });
    if (!profileId || !tipo) return res.status(400).json({ error: "Faltan datos de autor" });

    // Validar que el `profileId` corresponde a un profesor y obtener su id DB
    let profesorId = null;
    if (tipo === "profesor") {
      const prof = await Profesores.findByPk(profileId);
      if (prof) profesorId = prof.id;
    }

    if (!profesorId) return res.status(400).json({ error: "Profesor no identificado o no autorizado" });

    // Subir archivo del ejercicio a Cloudinary y guardar `secure_url`
    const baseName = req.file.originalname.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "_");
    const cloudResult = await uploadToCloudinary(req.file.buffer, { folder: "nebriacademy/ejercicios", resource_type: "auto", public_id: baseName });

    const nuevo = await Ejercicios.create({ autor: profesorId, curso: curso || null, descripcion: descripcion || null, archivo: cloudResult.secure_url, nombre });

    // Si el ejercicio pertenece a un curso, notificar a los alumnos apuntados
    try {
      if (curso) {
        const c = await Cursos.findByPk(curso);
        const apuntados = await CursosAlumnos.findAll({ where: { cursoId: curso, apuntado: true } });
        const notificaciones = [];
        for (const ap of apuntados) {
          // Para cada alumno apuntado, preparar notificación
          const al = await Alumnos.findByPk(ap.alumnoId);
          if (al) {
            notificaciones.push({ usuarioId: al.usuarioId, tipoUsuario: "alumno", mensaje: `Nuevo ejercicio subido en el curso ${c ? c.nombreCurso : 'seleccionado'}`, enlace: `/Home/Courses/${curso}` });
          }
        }
        if (notificaciones.length > 0) await Notificaciones.bulkCreate(notificaciones);
      }
    } catch (errNoti) {
      console.error("Error creando notificaciones (ejercicios):", errNoti);
    }

    res.status(201).json({ id: nuevo.id, archivo: nuevo.archivo });
  } catch (error) {
    console.error("Error creando ejercicio:", error);
    res.status(500).json({ error: "Error creando ejercicio" });
  }
};

// Actualizar ejercicio y reemplazar archivo si procede
exports.update = async (req, res) => {
  try {
    const ej = await Ejercicios.findByPk(req.params.id);
    if (!ej) return res.status(404).json({ error: "No encontrado" });

    const updates = { ...req.body };

    // Si se envía nuevo archivo, borrar asset anterior en Cloudinary y subir el nuevo
    if (req.file) {
      if (ej.archivo && ej.archivo.includes('cloudinary.com')) {
        try {
          const resourceType = getResourceTypeFromUrl(ej.archivo);
          const pid = extractPublicId(ej.archivo, resourceType);
          if (pid) await cloudinary.uploader.destroy(pid, { resource_type: resourceType });
        } catch (e) {
          console.warn('No se pudo borrar ejercicio anterior de Cloudinary:', e.message);
        }
      }
      const baseName = req.file.originalname.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "_");
      const cloudResult = await uploadToCloudinary(req.file.buffer, { folder: "nebriacademy/ejercicios", resource_type: "auto", public_id: baseName });
      updates.archivo = cloudResult.secure_url;
    }

    const updated = await ej.update(updates);
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

// Eliminar ejercicio y limpiar recursos asociados
exports.remove = async (req, res) => {
  try {
    const ej = await Ejercicios.findByPk(req.params.id);
    if (!ej) return res.status(404).json({ error: "No encontrado" });

    if (ej.archivo && ej.archivo.includes('cloudinary.com')) {
      try {
        const resourceType = getResourceTypeFromUrl(ej.archivo);
        const pid = extractPublicId(ej.archivo, resourceType);
        if (pid) await cloudinary.uploader.destroy(pid, { resource_type: resourceType });
      } catch (e) {
        console.warn('No se pudo borrar ejercicio de Cloudinary:', e.message);
      }
    }

    const { reason } = req.query;
    if (reason) {
      try {
        const CursosAlumnos = require("../models/CursosAlumnos.js");
        const Alumnos = require("../models/Alumnos.js");

        if (ej.autor) {
          const prof = await Profesores.findByPk(ej.autor);
          if (prof && prof.usuarioId) {
            await Notificaciones.create({ usuarioId: prof.usuarioId, tipoUsuario: "profesor", mensaje: `Tu ejercicio "${ej.nombre}" ha sido eliminado. Razón: ${reason}`, fecha: new Date() });
          }
        }

        if (ej.curso) {
          const matriculados = await CursosAlumnos.findAll({ where: { cursoId: ej.curso, apuntado: true } });
          for (const m of matriculados) {
            const al = await Alumnos.findByPk(m.alumnoId);
            if (al && al.usuarioId) {
              await Notificaciones.create({ usuarioId: al.usuarioId, tipoUsuario: "alumno", mensaje: `Se ha eliminado un ejercicio ("${ej.nombre}") del curso en el que estás inscrito. Razón: ${reason}`, fecha: new Date() });
            }
          }
        }
      } catch (errNotif) {
        console.warn("Error enviando notificaciones de borrado (ejercicio):", errNotif.message);
      }
    }

    await ej.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};
