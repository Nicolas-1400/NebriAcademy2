// ==========================================
// 1. IMPORTACIONES
// ==========================================
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ==========================================
// 2. DEFINICIÓN DEL MODELO
// ==========================================
// Esquema de almacenamiento para materiales de estudio estáticos (PDFs, Word) vinculados a un temario.
const Apuntes = sequelize.define(
  "apuntes",
  {
    autor: DataTypes.INTEGER,
    curso: DataTypes.INTEGER,
    categoria: DataTypes.ENUM(
      "Programación",
      "Diseño",
      "Ciberseguridad",
      "BDD",
      "Marketing",
    ),
    nombre: DataTypes.TEXT,
    archivo: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    valoracion: { type: DataTypes.FLOAT, defaultValue: 0 },
  },
  { timestamps: false },
);

// ==========================================
// 3. EXPORTACIONES
// ==========================================
module.exports = Apuntes;
