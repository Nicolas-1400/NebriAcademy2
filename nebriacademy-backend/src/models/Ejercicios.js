// ==========================================
// 1. IMPORTACIONES
// ==========================================
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ==========================================
// 2. DEFINICIÓN DEL MODELO
// ==========================================
// Representa una asignación o deber académico propuesto por un profesor, incluyendo instrucciones y enunciados adjuntos.
const Ejercicios = sequelize.define(
  "ejercicios",
  {
    autor: DataTypes.INTEGER,
    curso: DataTypes.INTEGER,
    nombre: DataTypes.TEXT,
    archivo: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
  },
  { timestamps: false },
);

// ==========================================
// 3. EXPORTACIONES
// ==========================================
module.exports = Ejercicios;
