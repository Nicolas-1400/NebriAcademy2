const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// Modelo de CursosAlumnos - Relación entre cursos y alumnos (inscripción, favoritos, valoración)
const CursosAlumnos = sequelize.define(
  "cursosalumnos",
  {
    cursoId: DataTypes.INTEGER, // ID del curso
    alumnoId: DataTypes.INTEGER, // ID del alumno
    favorito: DataTypes.BOOLEAN, // Indica si el curso está marcado como favorito
    apuntado: DataTypes.BOOLEAN, // Indica si el alumno está inscrito en el curso
    valoracion: { type: DataTypes.BOOLEAN, field: "valoración" }, // Valoración del alumno al curso
  },
  { timestamps: false },
);

module.exports = CursosAlumnos;
