// ==========================================
// 1. IMPORTACIONES
// ==========================================
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ==========================================
// 2. DEFINICIÓN DEL MODELO
// ==========================================
// Tabla organizativa que liga a uno o más profesores con la administración coordinada de un aula virtual conjunta.
const ProfesoresCursos = sequelize.define(
  "profesorescursos",
  {
    profesorId: DataTypes.INTEGER,
    cursoId: DataTypes.INTEGER,
  },
  { timestamps: false },
);

// ==========================================
// 3. EXPORTACIONES
// ==========================================
module.exports = ProfesoresCursos;
