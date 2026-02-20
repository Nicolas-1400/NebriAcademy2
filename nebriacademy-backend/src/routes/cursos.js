// ==========================================
// 1. IMPORTACIONES
// ==========================================
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const Cursos = require("../models/Cursos.js");
const Profesores = require("../models/Profesores.js");
const ProfesoresCursos = require("../models/ProfesoresCursos.js");

// ==========================================
// 2. OBTENER DATOS (GET)
// ==========================================
// Usa findAll en la tabla Cursos y completa propiedades vacías de la petición.
router.get("/", async (req, res) => {
  try {
    console.log("Petición recibida: GET /cursos");

    const resultado = await Cursos.findAll();

    const map = [
      "Foto10",
      "Foto1",
      "Foto2",
      "Foto3",
      "Foto4",
      "Foto5",
      "Foto6",
      "Foto7",
      "Foto8",
      "Foto9",
    ];

    for (const curso of resultado) {
      if (!curso.imagen || curso.imagen.trim() === "") {
        const index = curso.id % 10;
        const imageName = map[index];
        try {
          await Cursos.update(
            { imagen: imageName },
            { where: { id: curso.id } },
          );
          curso.imagen = imageName;
        } catch (e) {
          console.error(`Backfill error for curso ${curso.id}: ${e.message}`);
        }
      }
    }

    res.json({
      "Numero de cursos": resultado.length,
      Cursos: resultado,
    });
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get("/categorias", (req, res) => {
  try {
    const categ = Cursos.getAttributes().categoria.values;
    res.json({ categorias: categ });
  } catch (e) {
    console.error("Error devolviendo categorias Cursos:", e);
    res.status(500).json({ categorias: [] });
  }
});

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

// ==========================================
// 3. CREACIÓN (POST)
// ==========================================
// Inserta en modelo usando variables JSON y adjunta una tabla n:m a posterior.
router.post("/add", async (req, res) => {
  try {
    const data = req.body || {};
    const profesorInput = data.profesor;
    let profesorDbId = null;

    if (profesorInput) {
      const porId = await Profesores.findByPk(profesorInput);
      if (porId) {
        profesorDbId = porId.id;
      } else {
        const porUsuario = await Profesores.findOne({
          where: { usuarioId: profesorInput },
        });
        if (porUsuario) profesorDbId = porUsuario.id;
      }
    }

    const cursoData = { valoracion: 0, ...data, profesor: profesorDbId };
    const nuevo = await Cursos.create(cursoData);

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

// ==========================================
// 4. ACTUALIZACIÓN (PUT)
// ==========================================
// Sobrescribe valores JSON a través del objeto extraído por params id.
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

// ==========================================
// 5. ELIMINACIÓN MASIVA (DELETE CACHE & DB)
// ==========================================
// Aplica unlink en FS sobre bucles en tablas relacionadas, culminando en un rotundo destroy.
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`Petición recibida: DELETE /cursos/${id}`);

    const curso = await Cursos.findByPk(id);

    if (!curso) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }

    // 1. Obtener y eliminar Videos
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

    // 2. Obtener y eliminar Apuntes
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

    // 3. Obtener y eliminar Ejercicios (del profesor)
    const ejercicios = await require("../models/Ejercicios.js").findAll({
      where: { curso: id },
    });
    // Para cada ejercicio, eliminar entregas de alumnos y el archivo del ejercicio
    for (const e of ejercicios) {
      // 3.1 Eliminar entregas de alumnos asociadas a este ejercicio
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

      // 3.2 Eliminar puntuaciones
      await require("../models/PuntuacionesEjercicios.js").destroy({
        where: { ejercicioId: e.id },
      });

      // 3.3 Eliminar archivo del ejercicio (si existe)
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

    // 4. Eliminar Comentarios
    await require("../models/ComentatioAlumnoCurso.js").destroy({
      where: { cursoId: id },
    });

    // 5. Eliminar Relaciones (CursosAlumnos, ProfesoresCursos)
    await require("../models/CursosAlumnos.js").destroy({
      where: { cursoId: id },
    });
    await require("../models/ProfesoresCursos.js").destroy({
      where: { cursoId: id },
    });

    // 6. Eliminar el Curso
    await curso.destroy();

    res.json({ mensaje: "Curso y todo su contenido eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ==========================================
// 6. EXPORTACIONES
// ==========================================
// Se exportan las rutas para que la aplicación las lea y las exponga al frontend.
module.exports = router;
