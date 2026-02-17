const express = require("express");
const router = express.Router();
const Cursos = require("../models/Cursos.js");
const Profesores = require("../models/Profesores.js");
const ProfesoresCursos = require("../models/ProfesoresCursos.js");

// ==================================================================
// RUTA: Obtener todos los cursos
// Método: GET /
// ==================================================================
router.get("/", async (req, res) => {
  try {
    console.log("Petición recibida: GET /cursos");

    // Recuperar todos los cursos de BBDD
    const resultado = await Cursos.findAll();

    // Mapping para backfill (misma lógica que frontend legacy)
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

    // Verificar y actualizar imágenes vacías
    for (const curso of resultado) {
      if (!curso.imagen || curso.imagen.trim() === "") {
        const index = curso.id % 10;
        const imageName = map[index];
        try {
          // Force update specifically
          await Cursos.update(
            { imagen: imageName },
            { where: { id: curso.id } },
          );
          // Update local instance for response
          curso.imagen = imageName;
        } catch (e) {
          console.error(`Backfill error for curso ${curso.id}: ${e.message}`);
        }
      }
    }

    // Devolvemos un objeto con meta-información (cantidad) y la lista
    res.json({
      "Numero de cursos": resultado.length,
      Cursos: resultado,
    });
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// ==================================================================
// RUTA: Obtener categorías de cursos
// Método: GET /categorias
// ==================================================================
router.get("/categorias", (req, res) => {
  try {
    // Extraer valores del ENUM 'categoria'
    const vals = (Cursos && Cursos.categoria && Cursos.categoria.values) || [];

    res.json({ categorias: vals });
  } catch (e) {
    console.error("Error devolviendo categorias Cursos:", e);
    res.status(500).json({ categorias: [] });
  }
});

// ==================================================================
// RUTA: Obtener curso por ID
// Método: GET /:id
// ==================================================================
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

// ==================================================================
// RUTA: Crear un nuevo curso
// Método: POST /add
// ==================================================================
router.post("/add", async (req, res) => {
  try {
    const data = req.body || {};
    const profesorInput = data.profesor;
    let profesorDbId = null;

    // Verificar si se proporcionó un profesor (por ID o usuarioId)
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

    // Crear el curso en la base de datos
    const cursoData = { valoracion: 0, ...data, profesor: profesorDbId };
    const nuevo = await Cursos.create(cursoData);

    // Crear la relación (Profesores <-> Cursos) si corresponde
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

// ==================================================================
// RUTA: Actualizar un curso
// Método: PUT /:id
// ==================================================================
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

// ==================================================================
// RUTA: Eliminar un curso
// Método: DELETE /:id
// ==================================================================
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
