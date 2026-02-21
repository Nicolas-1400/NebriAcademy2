// ── IMPORTACIONES ───────────────────────────────────────────────────────────
// Importamos DataTypes para definir los tipos de columna y la conexión a la BD
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ── MODELO ────────────────────────────────────────────────────────────────────
// Definimos el modelo "videos". Cada vídeo pertenece a un curso y tiene un autor (profesor)
const Videos = sequelize.define(
  "videos",
  {
    autor: DataTypes.INTEGER,
    curso: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    archivo: DataTypes.STRING,
  },
  { timestamps: false },
);

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = Videos;
