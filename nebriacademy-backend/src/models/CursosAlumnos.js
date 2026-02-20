// ==========================================
// 1. IMPORTACIONES
// ==========================================
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ==========================================
// 2. DEFINICIÓN DEL MODELO
// ==========================================
// Relación de matrícula. Determina qué cuentas de estudiantes tienen derecho legal de visualización sobre un curso.
const CursosAlumnos = sequelize.define(
  "cursosalumnos",
  {
    cursoId: DataTypes.INTEGER,
    alumnoId: DataTypes.INTEGER,
    favorito: DataTypes.BOOLEAN,
    apuntado: DataTypes.BOOLEAN,
    valoracion: { type: DataTypes.BOOLEAN, field: "valoración" },
  },
  { timestamps: false },
);

// ==========================================
// 3. EXPORTACIONES
// ==========================================
module.exports = CursosAlumnos;
