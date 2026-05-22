const cloudinary = require("../routes/cloudinary");
const { uploadToCloudinary, extractPublicId, getResourceTypeFromUrl } = require("../utils/cloudinaryHelper");
const Apuntes = require("../models/Apuntes.js");
const Administradores = require("../models/Administradores.js");
const Profesores = require("../models/Profesores.js");
const Alumnos = require("../models/Alumnos.js");
const Cursos = require("../models/Cursos.js");
const Notificaciones = require("../models/Notificaciones.js");
const CursosAlumnos = require("../models/CursosAlumnos.js");
const ProfesoresCursos = require("../models/ProfesoresCursos.js");

// Helpers compartidos importados

module.exports = {
  listAll: async (req, res) => {
    try {
      const data = await Apuntes.findAll();
      res.json({ "Numero de apuntes": data.length, Apuntes: data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },

  categorias: (req, res) => {
    try {
      const categ = Apuntes.getAttributes()?.categoria?.values || [];
      res.json({ categorias: categ });
    } catch (e) {
      res.status(500).json({ categorias: [] });
    }
  },

  getById: async (req, res) => {
    try {
      const apunte = await Apuntes.findByPk(req.params.id);
      apunte
        ? res.json(apunte)
        : res.status(404).json({ error: "No encontrado" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },

  create: async (req, res) => {
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
        const u = await Administradores.findByPk(profileId);
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

      const baseName = req.file.originalname
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-zA-Z0-9._-]/g, "_");
      const cloudResult = await uploadToCloudinary(req.file.buffer, {
        folder: "nebriacademy/apuntes",
        resource_type: "auto",
        public_id: baseName,
      });

      const nuevo = await Apuntes.create({
        autor: autorFinal,
        curso: cursoId || null,
        categoria,
        archivo: cloudResult.secure_url,
        descripcion,
        valoracion: 0,
        nombre: nombre || req.file.originalname,
      });

      try {
        if (cursoId) {
          const c = await Cursos.findByPk(cursoId);
          if (tipo === "profesor" || tipo === "administrador") {
            const apuntados = await CursosAlumnos.findAll({ where: { cursoId, apuntado: true } });
            const notificaciones = [];
            for (const ap of apuntados) {
              const al = await Alumnos.findByPk(ap.alumnoId);
              if (al) {
                notificaciones.push({
                  usuarioId: al.usuarioId,
                  tipoUsuario: "alumno",
                  mensaje: `Nuevo apunte subido en el curso ${c ? c.nombreCurso : 'seleccionado'}`,
                  enlace: `/Home/Courses/${cursoId}`
                });
              }
            }
            if (notificaciones.length > 0) await Notificaciones.bulkCreate(notificaciones);
          } else if (tipo === "alumno") {
            const arrProfesores = await ProfesoresCursos.findAll({ where: { cursoId } });
            const notificaciones = [];
            for (const pc of arrProfesores) {
              const p = await Profesores.findByPk(pc.profesorId);
              if (p) {
                const u = await Alumnos.findByPk(profileId);
                notificaciones.push({
                  usuarioId: p.usuarioId,
                  tipoUsuario: "profesor",
                  mensaje: `El alumno ${u ? u.nombre : 'Anónimo'} ha subido un apunte al curso ${c ? c.nombreCurso : 'seleccionado'}`,
                  enlace: `/Home/Courses/${cursoId}`
                });
              }
            }
            if (notificaciones.length > 0) await Notificaciones.bulkCreate(notificaciones);
          }
        }
      } catch (errNoti) {
        console.error("Error creando notificaciones (apuntes):", errNoti);
      }

      res.status(201).json({ id: nuevo.id, archivo: nuevo.archivo });
    } catch (error) {
      console.error("Error subida apunte:", error);
      res.status(500).json({ error: "Error creando apunte" });
    }
  },

  update: async (req, res) => {
    try {
      const apunte = await Apuntes.findByPk(req.params.id);
      if (!apunte) return res.status(404).json({ error: "No encontrado" });

      const updates = { ...req.body };

      if (req.file) {
        if (apunte.archivo && apunte.archivo.includes('cloudinary.com')) {
          try {
            const resourceType = getResourceTypeFromUrl(apunte.archivo);
            const pid = extractPublicId(apunte.archivo, resourceType);
            if (pid) await cloudinary.uploader.destroy(pid, { resource_type: resourceType });
          } catch (e) {
            console.warn('No se pudo borrar asset anterior de Cloudinary:', e.message);
          }
        }

        const baseName = req.file.originalname
          .replace(/\.[^.]+$/, "")
          .replace(/[^a-zA-Z0-9._-]/g, "_");
        const cloudResult2 = await uploadToCloudinary(req.file.buffer, {
          folder: 'nebriacademy/apuntes',
          resource_type: 'auto',
          public_id: baseName,
        });
        updates.archivo = cloudResult2.secure_url;
      }

      const actualizado = await apunte.update(updates);
      res.json(actualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error actualizando" });
    }
  },

  remove: async (req, res) => {
    try {
      const apunte = await Apuntes.findByPk(req.params.id);
      if (!apunte) return res.status(404).json({ error: "No encontrado" });

      if (apunte.archivo && apunte.archivo.includes('cloudinary.com')) {
        try {
          const resourceType = getResourceTypeFromUrl(apunte.archivo);
          const pid = extractPublicId(apunte.archivo, resourceType);
          if (pid) await cloudinary.uploader.destroy(pid, { resource_type: resourceType });
        } catch (e) {
          console.warn('No se pudo borrar asset de Cloudinary:', e.message);
        }
      }

      const { reason } = req.query;
      if (reason) {
        try {
          if (apunte.autor) {
            await Notificaciones.create({
              usuarioId: apunte.autor,
              mensaje: `Tu apunte "${apunte.nombre}" ha sido eliminado. Razón: ${reason}`,
              fecha: new Date(),
            });
          }

          if (apunte.curso) {
            const matriculados = await CursosAlumnos.findAll({ 
              where: { cursoId: apunte.curso, apuntado: true } 
            });
            for (const m of matriculados) {
              if (m.alumnoId && String(m.alumnoId) !== String(apunte.autor)) {
                const al = await Alumnos.findByPk(m.alumnoId);
                if (al && al.usuarioId) {
                  await Notificaciones.create({
                    usuarioId: al.usuarioId,
                    tipoUsuario: "alumno",
                    mensaje: `Se ha eliminado un apunte ("${apunte.nombre}") del curso en el que estás inscrito. Razón: ${reason}`,
                    fecha: new Date(),
                  });
                }
              }
            }
          }
        } catch (errNotif) {
          console.warn("Error enviando notificaciones de borrado (apunte):", errNotif.message);
        }
      }

      await apunte.destroy();

      res.json({ mensaje: "Eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error eliminando" });
    }
  }
};
