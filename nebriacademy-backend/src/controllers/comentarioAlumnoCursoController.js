// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const ComentarioAlumnoCurso = require("../models/ComentatioAlumnoCurso.js");
const Alumnos = require("../models/Alumnos.js");
const Administradores = require("../models/Administradores.js");
const Cursos = require("../models/Cursos.js");
const Notificaciones = require("../models/Notificaciones.js");

// ── CONTROLADOR: comentarioAlumnoCurso ───────────────────────────────────────
// Gestión de comentarios de alumnos en cursos: CRUD y notificaciones asociadas

// Listar comentarios (opcionalmente filtrados por curso)
exports.listAll = async (req, res) => {
  try {
    const { cursoId } = req.query;

    // Si se recibe cursoId como query param, filtramos; si no, devolvemos todos
    const filtro = cursoId ? { where: { cursoId } } : {};
    const comentarios = await ComentarioAlumnoCurso.findAll(filtro);

    // Añadimos a cada comentario el nombre y apellidos del autor (alumno)
    const enhanced = await Promise.all(
      comentarios.map(async (c) => {
        let nombre = "Usuario", apellidos = "";

        // Buscamos el alumno por su usuarioId para obtener datos de presentación
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
};

// Obtener comentario por id
exports.getById = async (req, res) => {
  try {
    const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
    c ? res.json(c) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Error servidor" });
  }
};

// Crear un comentario de alumno en un curso
exports.create = async (req, res) => {
  try {
    const { profileId, tipo, cursoId, comentario } = req.body;
    if (!profileId || !tipo || !cursoId || !comentario)
      return res.status(400).json({ error: "Faltan datos" });

    // Solo alumnos pueden crear comentarios; obtenemos su usuarioId para almacenarlo
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
};

// Actualizar un comentario (solo el autor puede modificarlo)
exports.update = async (req, res) => {
  try {
    const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "No encontrado" });

    const { profileId, tipo, comentario } = req.body;

    // Resolvemos el usuarioId del solicitante para compararlo con el autor del comentario
    let requesterUsuarioId = null;
    if (tipo === "alumno") {
      const u = await Alumnos.findByPk(profileId);
      if (u) requesterUsuarioId = u.usuarioId;
    }

    // Solo el propio autor puede editar su comentario
    if (!requesterUsuarioId || requesterUsuarioId !== c.usuarioId) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const actualizado = await c.update({ comentario: comentario || c.comentario });
    res.json(actualizado);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error servidor" });
  }
};

// Eliminar comentario con autorización por rol y notificación opcional al autor
exports.remove = async (req, res) => {
  try {
    const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "No encontrado" });

    const { profileId, tipo } = req.query;
    const { reason } = req.query;

    // Determinamos si el solicitante tiene permisos para eliminar el comentario:
    // - administradores siempre pueden
    // - profesores solo si son el responsable del curso
    // - alumnos solo si son el autor del comentario
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

    // Detectamos si el que borra es el propio autor para omitir la notificación en ese caso
    const u_deleter = tipo === "alumno" ? await Alumnos.findByPk(profileId) : null;
    const isOwnerDeleting = u_deleter && u_deleter.usuarioId === c.usuarioId;

    // Solo notificamos al autor si el borrado lo realiza un tercero y se aporta razón
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
};
