const ComentarioAlumnoCurso = require("../models/ComentatioAlumnoCurso.js");
const Alumnos = require("../models/Alumnos.js");
const Administradores = require("../models/Administradores.js");
const Cursos = require("../models/Cursos.js");
const Notificaciones = require("../models/Notificaciones.js");

module.exports = {
  listAll: async (req, res) => {
    try {
      const { cursoId } = req.query;

      const filtro = cursoId ? { where: { cursoId } } : {};
      const comentarios = await ComentarioAlumnoCurso.findAll(filtro);

      const enhanced = await Promise.all(
        comentarios.map(async (c) => {
          let nombre = "Usuario", apellidos = "";

          let autor = await Alumnos.findOne({ where: { usuarioId: c.usuarioId } });
          if (autor) {
            nombre = autor.nombre;
            apellidos = autor.apellidos;
          }

          return {
            id: c.id,
            usuarioId: c.usuarioId,
            cursoId: c.cursoId,
            comentario: c.comentario,
            nombre,
            apellidos,
          };
        }),
      );

      res.json({ "Numero de comentarios": enhanced.length, Comentarios: enhanced });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error del servidor" });
    }
  },

  getById: async (req, res) => {
    try {
      const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
      c ? res.json(c) : res.status(404).json({ error: "No encontrado" });
    } catch (e) {
      res.status(500).json({ error: "Error servidor" });
    }
  },

  create: async (req, res) => {
    try {
      const { profileId, tipo, cursoId, comentario } = req.body;
      if (!profileId || !tipo || !cursoId || !comentario)
        return res.status(400).json({ error: "Faltan datos" });

      let usuarioId = null;
      if (tipo === "alumno") {
        const u = await Alumnos.findByPk(profileId);
        if (u) usuarioId = u.usuarioId;
      }

      if (!usuarioId) return res.status(404).json({ error: "Usuario no encontrado" });

      const nuevo = await ComentarioAlumnoCurso.create({ usuarioId, cursoId, comentario });
      res.status(201).json(nuevo);
    } catch (e) {
      console.error("Error creando comentario:", e);
      res.status(500).json({ error: "Error servidor" });
    }
  },

  update: async (req, res) => {
    try {
      const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
      if (!c) return res.status(404).json({ error: "No encontrado" });

      const { profileId, tipo, comentario } = req.body;

      let requesterUsuarioId = null;
      if (tipo === "alumno") {
        const u = await Alumnos.findByPk(profileId);
        if (u) requesterUsuarioId = u.usuarioId;
      }

      if (!requesterUsuarioId || requesterUsuarioId !== c.usuarioId) {
        return res.status(403).json({ error: "No autorizado" });
      }

      const actualizado = await c.update({ comentario: comentario || c.comentario });
      res.json(actualizado);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error servidor" });
    }
  },

  remove: async (req, res) => {
    try {
      const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
      if (!c) return res.status(404).json({ error: "No encontrado" });

      const { profileId, tipo } = req.query;
      const { reason } = req.query;

      let authorized = false;
      if (tipo === "administrador") {
        authorized = true;
      } else if (tipo === "profesor") {
        const c_curso = await Cursos.findByPk(c.cursoId);
        if (c_curso && String(c_curso.profesor) === String(profileId)) {
          authorized = true;
        }
      } else if (tipo === "alumno") {
        const u = await Alumnos.findByPk(profileId);
        if (u && u.usuarioId === c.usuarioId) {
          authorized = true;
        }
      }

      if (!authorized) return res.status(403).json({ error: "No autorizado" });

      const u_deleter = tipo === "alumno" ? await Alumnos.findByPk(profileId) : null;
      const isOwnerDeleting = u_deleter && u_deleter.usuarioId === c.usuarioId;

      if (reason && c.usuarioId && !isOwnerDeleting) {
        try {
          const curso = await Cursos.findByPk(c.cursoId);
          await Notificaciones.create({
            usuarioId: c.usuarioId,
            tipoUsuario: "alumno",
            mensaje: `Tu comentario en el curso "${curso ? curso.nombreCurso : 'seleccionado'}" ha sido eliminado. Razón: ${reason}`,
            fecha: new Date(),
          });
        } catch (errNotif) {
          console.warn("Error enviando notificación de borrado (comentario):", errNotif.message);
        }
      }

      await c.destroy();
      res.json({ mensaje: "Eliminado" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error servidor" });
    }
  },
};
