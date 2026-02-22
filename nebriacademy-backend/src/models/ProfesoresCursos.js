// ── IMPORTACIONES ───────────────────────────────────────────────────────────
// Importamos DataTypes para definir los tipos de columna y la conexión a la BDD
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ── MODELO ────────────────────────────────────────────────────────────────────
// Tabla intermedia que vincula a cada profesor con los cursos que imparte
const ProfesoresCursos = sequelize.define(
  "profesorescursos",
  {
    profesorId: DataTypes.INTEGER,
    cursoId: DataTypes.INTEGER,
  },
  { timestamps: false },
);

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = ProfesoresCursos;
