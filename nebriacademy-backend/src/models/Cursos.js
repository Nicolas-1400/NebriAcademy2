const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// Modelo de Cursos - Cursos disponibles en la plataforma
const Cursos = sequelize.define(
  "cursos",
  {
    nombreCurso: DataTypes.STRING, // Nombre del curso
    categoria: DataTypes.ENUM(
      "Programación",
      "Diseño",
      "Ciberseguridad",
      "BDD",
      "Marketing",
    ), // Categoría para filtrar y organizar los cursos en el catálogo
    profesor: DataTypes.INTEGER, // Referencia al ID de la tabla 'profesores'. Indica el profesor principal del curso.
    nivel: DataTypes.STRING, // Nivel de dificultad (Básico, Intermedio, Avanzado)
    valoracion: DataTypes.FLOAT, // Promedio de valoraciones de los alumnos
    descripcion: DataTypes.TEXT, // Explicación detallada del contenido y objetivos del curso
    imagen: DataTypes.STRING, // Nombre de la imagen de fondo seleccionada
  },
  { timestamps: false },
);

module.exports = Cursos;
