const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// Modelo de Apuntes - Documentos y materiales de estudio subidos por usuarios
const Apuntes = sequelize.define(
  "apuntes",
  {
    autor: DataTypes.INTEGER, // Referencia al ID de la tabla 'usuarios'. Tanto alumnos como profesores pueden subir apuntes.
    curso: DataTypes.INTEGER, // ID del curso asociado. Permite organizar el material por asignaturas
    categoria: DataTypes.ENUM(
      "Programación",
      "Diseño",
      "Ciberseguridad",
      "BDD",
      "Marketing",
    ), // Categoría temática del apunte
    nombre: DataTypes.TEXT, // Título descriptivo del documento
    archivo: DataTypes.STRING, // URN o ruta relativa donde se almacena el fichero físico (PDF, DOCX, etc.)
    descripcion: DataTypes.TEXT, // Resumen o notas adicionales sobre el contenido
    valoracion: { type: DataTypes.FLOAT, defaultValue: 0 }, // Puntuación media otorgada por la comunidad
  },
  { timestamps: false },
);

module.exports = Apuntes;
