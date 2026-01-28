const express = require('express');
const router = express.Router();
const Cursos = require("../models/Cursos.js");
const Profesores = require("../models/Profesores.js");
const ProfesoresCursos = require("../models/ProfesoresCursos.js");

// POST /addCurso  -> crear curso y asignar relaciones en profesorescursos
router.post('/', async (req, res) => {
  try {
    const data = req.body || {};
    const profesorInput = data.profesor;

    // Resolver el profesor creador: primero por PK, si no por usuarioId
    let profesorDbId = null;
    if (profesorInput) {
      const porId = await Profesores.findByPk(profesorInput);
      if (porId) {
        profesorDbId = porId.id;
      } else {
        const porUsuario = await Profesores.findOne({ where: { usuarioId: profesorInput } });
        if (porUsuario) profesorDbId = porUsuario.id;
      }
    }

    // Preparar datos del curso
    const cursoData = { ...data, profesor: profesorDbId };

    // Crear el curso
    const nuevo = await Cursos.create(cursoData);
    const cursoId = nuevo.id;

    // Añadir relación del profesor creador
    if (profesorDbId) {
      await ProfesoresCursos.create({ profesorId: profesorDbId, cursoId });
    }

    

    res.status(201).json(nuevo);
  } catch (err) {
    console.error('Error en /addCurso:', err);
    res.status(500).json({ error: 'Error al crear curso', detail: err.message });
  }
});

module.exports = router;