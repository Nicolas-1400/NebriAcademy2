const path = require("path");
const fs = require("fs");
const Cursos = require("../models/Cursos.js");
const Profesores = require("../models/Profesores.js");
const ProfesoresCursos = require("../models/ProfesoresCursos.js");

module.exports = {
  listAll: async (req, res) => {
    try {
      const resultado = await Cursos.findAll();
      res.json({ "Numero de cursos": resultado.length, Cursos: resultado });
    } catch (error) {
      console.error("Error al obtener cursos:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  categorias: (req, res) => {
    try {
      const categ = Cursos.getAttributes().categoria.values;
      res.json({ categorias: categ });
    } catch (e) {
      console.error("Error devolviendo categorias Cursos:", e);
      res.status(500).json({ categorias: [] });
    }
  },

  getById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const curso = await Cursos.findByPk(id);
      if (curso) res.json(curso);
      else res.status(404).json({ error: "Curso no encontrado" });
    } catch (error) {
      console.error("Error al obtener curso:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  add: async (req, res) => {
    try {
      const data = req.body || {};
      const profesorInput = data.profesor;
      let profesorDbId = null;

      if (profesorInput) {
        const porId = await Profesores.findByPk(profesorInput);
        if (porId) profesorDbId = porId.id;
        else {
          const porUsuario = await Profesores.findOne({ where: { usuarioId: profesorInput } });
          if (porUsuario) profesorDbId = porUsuario.id;
        }
      }

      const cursoData = { valoracion: 0, ...data, profesor: profesorDbId };
      const nuevo = await Cursos.create(cursoData);

      if (profesorDbId) {
        await ProfesoresCursos.create({ profesorId: profesorDbId, cursoId: nuevo.id });
      }

      res.status(201).json(nuevo);
    } catch (err) {
      console.error("Error en /cursos/add:", err);
      res.status(500).json({ error: "Error al crear curso", detail: err.message });
    }
  },

  update: async (req, res) => {
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
  },

  remove: async (req, res) => {
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

      const videos = await require("../models/Videos.js").findAll({ where: { curso: id } });
      for (const v of videos) {
        if (v.archivo) {
          const p = path.join(__dirname, "../../../nebriacademy-frontend/src/assets/Videos", v.archivo);
          fs.promises.unlink(p).catch((e) => console.warn(`Error borrando video físico: ${e.message}`));
        }
        await v.destroy();
      }

      const apuntes = await require("../models/Apuntes.js").findAll({ where: { curso: id } });
      for (const a of apuntes) {
        if (a.archivo) {
          const p = path.join(__dirname, "../../../nebriacademy-frontend/src/assets/Apuntes", a.archivo);
          fs.promises.unlink(p).catch((e) => console.warn(`Error borrando apunte físico: ${e.message}`));
        }
        await a.destroy();
      }

      const ejercicios = await require("../models/Ejercicios.js").findAll({ where: { curso: id } });
      for (const e of ejercicios) {
        const entregas = await require("../models/EjerciciosAlumnos.js").findAll({ where: { ejercicioId: e.id } });
        for (const ent of entregas) {
          if (ent.archivo) {
            const p = path.join(__dirname, "../../../nebriacademy-frontend/src/assets/EjerciciosAlumnos", ent.archivo);
            fs.promises.unlink(p).catch((err) => console.warn(`Error borrando entrega física: ${err.message}`));
          }
          await ent.destroy();
        }

        await require("../models/PuntuacionesEjercicios.js").destroy({ where: { ejercicioId: e.id } });

        if (e.archivo) {
          const p = path.join(__dirname, "../../../nebriacademy-frontend/src/assets/Ejercicios", e.archivo);
          fs.promises.unlink(p).catch((err) => console.warn(`Error borrando ejercicio físico: ${err.message}`));
        }
        await e.destroy();
      }

      await require("../models/ComentatioAlumnoCurso.js").destroy({ where: { cursoId: id } });
      await require("../models/CursosAlumnos.js").destroy({ where: { cursoId: id } });
      await require("../models/ProfesoresCursos.js").destroy({ where: { cursoId: id } });

      await curso.destroy();

      res.json({ mensaje: "Curso y todo su contenido eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar curso:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
};
