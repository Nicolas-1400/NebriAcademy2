const express = require("express");
const router = express.Router();
const Cursos = require("../models/Cursos.js");
const Profesores = require("../models/Profesores.js");
const ProfesoresCursos = require("../models/ProfesoresCursos.js");

// Rutas de Obtención
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
    const categ = Cursos.rawAttributes.categoria.values;
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

// Rutas de Creación
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

// Rutas de Actualización
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

// Rutas de Eliminación
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`Petición recibida: DELETE /cursos/${id}`);

    const curso = await Cursos.findByPk(id);

    if (curso) {
      await curso.destroy();
      res.json({ mensaje: "Curso eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Curso no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
