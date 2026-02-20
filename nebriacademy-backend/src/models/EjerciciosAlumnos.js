// ==========================================
// 1. IMPORTACIONES
// ==========================================
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ==========================================
// 2. DEFINICIÓN DEL MODELO
// ==========================================
// Casillero de entregas. Archiva el PDF/ZIP que un alumno sube en respuesta a una asignación concreta.
const EjerciciosAlumnos = sequelize.define(
  "ejerciciosalumnos",
  {
    ejercicioId: DataTypes.INTEGER,
    alumnoId: DataTypes.INTEGER,
    archivo: DataTypes.STRING,
  },
  { timestamps: false },
);

// ==========================================
// 3. EXPORTACIONES
// ==========================================
module.exports = EjerciciosAlumnos;
