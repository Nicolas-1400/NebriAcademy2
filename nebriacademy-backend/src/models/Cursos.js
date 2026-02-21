// ==========================================
// 1. IMPORTACIONES
// ==========================================
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ==========================================
// 2. DEFINICIÓN DEL MODELO
// ==========================================
const Cursos = sequelize.define(
  "cursos",
  {
    nombreCurso: DataTypes.STRING,
    categoria: DataTypes.ENUM(
      "Programación",
      "Diseño",
      "Ciberseguridad",
      "BDD",
      "Marketing",
    ),
    profesor: DataTypes.INTEGER,
    nivel: DataTypes.STRING,
    valoracion: DataTypes.FLOAT,
    descripcion: DataTypes.TEXT,
    imagen: DataTypes.STRING,
  },
  { timestamps: false },
);

// ==========================================
// 3. EXPORTACIONES
// ==========================================
module.exports = Cursos;
