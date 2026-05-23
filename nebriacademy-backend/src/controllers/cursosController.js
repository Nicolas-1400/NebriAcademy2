// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const path = require("path");
const fs = require("fs");
const Cursos = require("../models/Cursos.js");
const Profesores = require("../models/Profesores.js");
const ProfesoresCursos = require("../models/ProfesoresCursos.js");

// ── CONTROLADOR: cursos ──────────────────────────────────────────────────────
// Listado, creación, actualización y borrado completo de cursos y su contenido
// Listar todos los cursos
exports.listAll = async (req, res) => {
  try {
    const resultado = await Cursos.findAll();
    res.json({ "Numero de cursos": resultado.length, Cursos: resultado });
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Devolver las categorías posibles del modelo Cursos
exports.categorias = (req, res) => {
  try {
    const categ = Cursos.getAttributes().categoria.values;
    res.json({ categorias: categ });
  } catch (e) {
    console.error("Error devolviendo categorias Cursos:", e);
    res.status(500).json({ categorias: [] });
  }
};

// Obtener curso por id
exports.getById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const curso = await Cursos.findByPk(id);
    if (curso) res.json(curso);
    else res.status(404).json({ error: "Curso no encontrado" });
  } catch (error) {
    console.error("Error al obtener curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Añadir nuevo curso; acepta referencia a profesor por id o usuarioId
exports.add = async (req, res) => {
  try {
    const data = req.body || {};
    const profesorInput = data.profesor;
    let profesorDbId = null;

    if (profesorInput) {
      // Intentamos primero encontrar el profesor por su id de BD
      const porId = await Profesores.findByPk(profesorInput);
      if (porId) profesorDbId = porId.id;
      else {
        // Si no se encontró por id de BD, probamos por usuarioId (para compatibilidad con el frontend)
        const porUsuario = await Profesores.findOne({ where: { usuarioId: profesorInput } });
        if (porUsuario) profesorDbId = porUsuario.id;
      }
    }

    // Forzamos valoracion inicial a 0 independientemente de lo que venga del body
    const cursoData = { valoracion: 0, ...data, profesor: profesorDbId };
    const nuevo = await Cursos.create(cursoData);

    // Registramos también la asignación en la tabla pivote ProfesoresCursos
    if (profesorDbId) {
      await ProfesoresCursos.create({ profesorId: profesorDbId, cursoId: nuevo.id });
    }

    res.status(201).json(nuevo);
  } catch (err) {
    console.error("Error en /cursos/add:", err);
    res.status(500).json({ error: "Error al crear curso", detail: err.message });
  }
};

// Actualizar curso por id
exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const curso = await Cursos.findByPk(id);
    if (curso) {
      const actualizado = await curso.update(req.body);
      res.json(actualizado);
    } else {
      res.status(404).json({ error: "Curso no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar curso y todo su contenido relacionado (videos, apuntes, ejercicios, matriculaciones)
exports.remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const curso = await Cursos.findByPk(id);
    if (!curso) return res.status(404).json({ error: "Curso no encontrado" });

    const { reason } = req.query;
    if (reason) {
      try {
        const Notificaciones = require("../models/Notificaciones.js");
        const Alumnos = require("../models/Alumnos.js");
        const CursosAlumnos = require("../models/CursosAlumnos.js");

        // Notificamos al profesor responsable del curso si tiene usuarioId asociado
        if (curso.profesor) {
          const prof = await Profesores.findByPk(curso.profesor);
          if (prof && prof.usuarioId) {
            await Notificaciones.create({
              usuarioId: prof.usuarioId,
              tipoUsuario: "profesor",
              mensaje: `El curso "${curso.nombreCurso}" ha sido eliminado. Razón: ${reason}`,
              fecha: new Date(),
            });
          }
        }

        // Notificamos también a todos los alumnos que estaban apuntados al curso
        const matriculados = await CursosAlumnos.findAll({ where: { cursoId: id, apuntado: true } });
        for (const m of matriculados) {
          const al = await Alumnos.findByPk(m.alumnoId);
          if (al && al.usuarioId) {
            await Notificaciones.create({
              usuarioId: al.usuarioId,
              tipoUsuario: "alumno",
              mensaje: `El curso "${curso.nombreCurso}" al que estabas apuntado ha sido eliminado. Razón: ${reason}`,
              fecha: new Date(),
            });
          }
        }
      } catch (errNotif) {
        console.warn("Error enviando notificaciones de borrado de curso:", errNotif.message);
      }
    }

    // Eliminar vídeos del curso: primero borramos ficheros físicos (si existen)
    // y después eliminamos la fila en la BD. Se usa la ruta del frontend para
    // proyectos donde los assets están en el repositorio del frontend.
    const videos = await require("../models/Videos.js").findAll({ where: { curso: id } });
    for (const v of videos) {
      // Si el vídeo tiene referencia a fichero local, intentar eliminarlo del FS
      if (v.archivo) {
        const p = path.join(__dirname, "../../../nebriacademy-frontend/src/assets/Videos", v.archivo);
        fs.promises.unlink(p).catch((e) => console.warn(`Error borrando video físico: ${e.message}`));
      }
      // Eliminar fila de la BD correspondiente al vídeo
      await v.destroy();
    }

    // Eliminar apuntes asociados: mismo patrón que en vídeos
    const apuntes = await require("../models/Apuntes.js").findAll({ where: { curso: id } });
    for (const a of apuntes) {
      // Borrar fichero del apunte si existe en assets locales
      if (a.archivo) {
        const p = path.join(__dirname, "../../../nebriacademy-frontend/src/assets/Apuntes", a.archivo);
        fs.promises.unlink(p).catch((e) => console.warn(`Error borrando apunte físico: ${e.message}`));
      }
      // Eliminar registro del apunte
      await a.destroy();
    }

    // Eliminar ejercicios y todas las entregas/puntuaciones relacionadas
    const ejercicios = await require("../models/Ejercicios.js").findAll({ where: { curso: id } });
    for (const e of ejercicios) {
      // Borrar entregas de alumnos asociadas al ejercicio
      const entregas = await require("../models/EjerciciosAlumnos.js").findAll({ where: { ejercicioId: e.id } });
      for (const ent of entregas) {
        // Para cada entrega, intentar borrar el fichero asociado y eliminar registro
        if (ent.archivo) {
          const p = path.join(__dirname, "../../../nebriacademy-frontend/src/assets/EjerciciosAlumnos", ent.archivo);
          fs.promises.unlink(p).catch((err) => console.warn(`Error borrando entrega física: ${err.message}`));
        }
        await ent.destroy();
      }

      // Eliminar puntuaciones asociadas al ejercicio (limpieza en cascada)
      await require("../models/PuntuacionesEjercicios.js").destroy({ where: { ejercicioId: e.id } });

      // Borrar archivo del propio ejercicio si existe y eliminar fila
      if (e.archivo) {
        const p = path.join(__dirname, "../../../nebriacademy-frontend/src/assets/Ejercicios", e.archivo);
        fs.promises.unlink(p).catch((err) => console.warn(`Error borrando ejercicio físico: ${err.message}`));
      }
      await e.destroy();
    }

    // Limpiar comentarios, relaciones y asignaciones asociadas al curso
    await require("../models/ComentatioAlumnoCurso.js").destroy({ where: { cursoId: id } });
    await require("../models/CursosAlumnos.js").destroy({ where: { cursoId: id } });
    await require("../models/ProfesoresCursos.js").destroy({ where: { cursoId: id } });

    await curso.destroy();

    res.json({ mensaje: "Curso y todo su contenido eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
