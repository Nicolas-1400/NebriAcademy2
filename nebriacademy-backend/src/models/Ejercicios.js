// ── IMPORTACIONES ───────────────────────────────────────────────────────────
// Importamos DataTypes para definir los tipos de columna y la conexión a la BD
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ── MODELO ────────────────────────────────────────────────────────────────────
// Definimos el modelo "ejercicios". Cada ejercicio lo crea un profesor y está asociado a un curso
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

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = Ejercicios;
