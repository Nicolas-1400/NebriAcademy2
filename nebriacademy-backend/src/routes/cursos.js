// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const Cursos = require("../models/Cursos.js");
const Profesores = require("../models/Profesores.js");
const ProfesoresCursos = require("../models/ProfesoresCursos.js");

// ── GET ─────────────────────────────────────────────────────────────────────
// GET /cursos — Devuelve todos los cursos registrados.
// La imagen de cada curso se resuelve en el frontend (TarjetaCursos.jsx) usando el nombre guardado en BDD o
// el ID del curso como fallback.
router.get("/", async (req, res) => {
  try {
    console.log("Petición recibida: GET /cursos");

    const resultado = await Cursos.findAll();

    res.json({
      "Numero de cursos": resultado.length,
      Cursos: resultado,
    });
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /cursos/categorias — Devuelve los valores válidos del campo categoria (los definidos en el ENUM)
router.get("/categorias", (req, res) => {
  try {
    const categ = Cursos.getAttributes().categoria.values;
    res.json({ categorias: categ });
  } catch (e) {
    console.error("Error devolviendo categorias Cursos:", e);
    res.status(500).json({ categorias: [] });
  }
});

// GET /cursos/:id — Devuelve un curso concreto por su ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`Petición recibida: GET /cursos/${id}`);

    const curso = await Cursos.findByPk(id);

    if (curso) {
      res.json(curso);
    } else {
      res.status(404).json({ error: "Curso no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ── POST ────────────────────────────────────────────────────────────────────
// POST /cursos/add — Crea un nuevo curso.
// Acepta el profesor por su ID directo o por su usuarioId, y crea también el vínculo en la tabla ProfesoresCursos.
router.post("/add", async (req, res) => {
  try {
    const data = req.body || {};
    const profesorInput = data.profesor;
    let profesorDbId = null;

    if (profesorInput) {
      // Intentamos encontrar al profesor por su ID de la tabla profesores
      const porId = await Profesores.findByPk(profesorInput);
      if (porId) {
        profesorDbId = porId.id;
      } else {
        // Si no lo encontramos por ID, lo buscamos por su usuarioId
        const porUsuario = await Profesores.findOne({
          where: { usuarioId: profesorInput },
        });
        if (porUsuario) profesorDbId = porUsuario.id;
      }
    }

    // Creamos el curso con valoracion inicial 0
    const cursoData = { valoracion: 0, ...data, profesor: profesorDbId };
    const nuevo = await Cursos.create(cursoData);

    // Registramos también la relación entre el profesor y el curso en la tabla intermedia
    if (profesorDbId) {
      await ProfesoresCursos.create({
        profesorId: profesorDbId,
        cursoId: nuevo.id,
      });
    }

    res.status(201).json(nuevo);
  } catch (err) {
    console.error("Error en /cursos/add:", err);
    res
      .status(500)
      .json({ error: "Error al crear curso", detail: err.message });
  }
});

// ── PUT ─────────────────────────────────────────────────────────────────────
// PUT /cursos/:id — Actualiza los datos de un curso con los campos que vengan en el body
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`Petición recibida: PUT /cursos/${id}`);

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
});

// ── DELETE ──────────────────────────────────────────────────────────────────
// DELETE /cursos/:id — Elimina un curso completo junto con todo su contenido asociado (borrado en cascada manual)
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`Petición recibida: DELETE /cursos/${id}`);

    const curso = await Cursos.findByPk(id);

    if (!curso) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    // Si se proporciona una razón (borrado por admin o profesor), notificamos a los afectados
    const { reason } = req.query;
    if (reason) {
      try {
        const Notificaciones = require("../models/Notificaciones.js");
        const Alumnos = require("../models/Alumnos.js");
        const CursosAlumnos = require("../models/CursosAlumnos.js");

        // 1. Notificar al profesor
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

        // 2. Notificar a todos los alumnos apuntados
        const matriculados = await CursosAlumnos.findAll({ 
          where: { cursoId: id, apuntado: true } 
        });
        
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

    // Borramos los vídeos del curso: primero el archivo físico y luego el registro en BDD
    const videos = await require("../models/Videos.js").findAll({
      where: { curso: id },
    });
    for (const v of videos) {
      if (v.archivo) {
        const p = path.join(
          __dirname,
          "../../../nebriacademy-frontend/src/assets/Videos",
          v.archivo,
        );
        fs.promises
          .unlink(p)
          .catch((e) =>
            console.warn(`Error borrando video físico: ${e.message}`),
          );
      }
      await v.destroy();
    }

    // Borramos los apuntes del curso: primero el archivo físico y luego el registro en BDD
    const apuntes = await require("../models/Apuntes.js").findAll({
      where: { curso: id },
    });
    for (const a of apuntes) {
      if (a.archivo) {
        const p = path.join(
          __dirname,
          "../../../nebriacademy-frontend/src/assets/Apuntes",
          a.archivo,
        );
        fs.promises
          .unlink(p)
          .catch((e) =>
            console.warn(`Error borrando apunte físico: ${e.message}`),
          );
      }
      await a.destroy();
    }

    // Borramos los ejercicios del curso y también las entregas y puntuaciones de cada uno
    const ejercicios = await require("../models/Ejercicios.js").findAll({
      where: { curso: id },
    });
    for (const e of ejercicios) {
      // Para cada ejercicio, borramos las entregas de los alumnos
      const entregas = await require("../models/EjerciciosAlumnos.js").findAll({
        where: { ejercicioId: e.id },
      });
      for (const ent of entregas) {
        if (ent.archivo) {
          const p = path.join(
            __dirname,
            "../../../nebriacademy-frontend/src/assets/EjerciciosAlumnos",
            ent.archivo,
          );
          fs.promises
            .unlink(p)
            .catch((err) =>
              console.warn(`Error borrando entrega física: ${err.message}`),
            );
        }
        await ent.destroy();
      }

      // Borramos también las puntuaciones que el profesor haya puesto a ese ejercicio
      await require("../models/PuntuacionesEjercicios.js").destroy({
        where: { ejercicioId: e.id },
      });

      if (e.archivo) {
        const p = path.join(
          __dirname,
          "../../../nebriacademy-frontend/src/assets/Ejercicios",
          e.archivo,
        );
        fs.promises
          .unlink(p)
          .catch((err) =>
            console.warn(`Error borrando ejercicio físico: ${err.message}`),
          );
      }
      await e.destroy();
    }

    // Borramos los comentarios y las relaciones alumno-curso asociadas a este curso
    await require("../models/ComentatioAlumnoCurso.js").destroy({
      where: { cursoId: id },
    });

    await require("../models/CursosAlumnos.js").destroy({
      where: { cursoId: id },
    });
    await require("../models/ProfesoresCursos.js").destroy({
      where: { cursoId: id },
    });

    // Finalmente eliminamos el propio curso
    await curso.destroy();

    res.json({ mensaje: "Curso y todo su contenido eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
