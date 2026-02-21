// ==========================================
// 1. IMPORTACIONES
// ==========================================
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ==========================================
// 2. DEFINICIÓN DEL MODELO
// ==========================================
// Repositorio audiovisual. Define los metadatos y la ruta local del archivo .mp4 hospedado estructuralmente en el servidor.
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

// ==========================================
// 3. EXPORTACIONES
// ==========================================
module.exports = Videos;
