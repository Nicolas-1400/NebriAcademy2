const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// Modelo de Videos - Videos educativos subidos a los cursos
const Videos = sequelize.define(
  "videos",
  {
    autor: DataTypes.INTEGER, // Referencia al ID de la tabla 'profesores' (NO 'usuarios'). Solo los profesores pueden subir vídeos.
    curso: DataTypes.INTEGER, // Vinculación con un curso específico
    nombre: DataTypes.STRING, // Título del vídeo
    archivo: DataTypes.STRING, // Ruta al archivo de vídeo (MP4, WebM) almacenado en el servidor
  },
  { timestamps: false },
);

module.exports = Videos;
