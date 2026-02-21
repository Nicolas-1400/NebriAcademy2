// ── IMPORTACIONES ───────────────────────────────────────────────────────────
// Importamos DataTypes para definir los tipos de columna y la conexión a la BD
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ── MODELO ────────────────────────────────────────────────────────────────────
// Tabla intermedia que registra las entregas de los alumnos: qué alumno entregó qué ejercicio y con qué archivo
const EjerciciosAlumnos = sequelize.define(
  "ejerciciosalumnos",
  {
    ejercicioId: DataTypes.INTEGER,
    alumnoId: DataTypes.INTEGER,
    archivo: DataTypes.STRING,
  },
  { timestamps: false },
);

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = EjerciciosAlumnos;
