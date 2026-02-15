const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// Modelo de ProfesoresCursos - Relación entre profesores y cursos que imparten
const ProfesoresCursos = sequelize.define(
  "profesorescursos",
  {
    profesorId: DataTypes.INTEGER, // ID del profesor
    cursoId: DataTypes.INTEGER, // ID del curso
  },
  { timestamps: false },
);

module.exports = ProfesoresCursos;
