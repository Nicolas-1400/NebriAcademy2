const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// Modelo de Ejercicios - Ejercicios y tareas asignadas en los cursos
const Ejercicios = sequelize.define(
  "ejercicios",
  {
    autor: DataTypes.INTEGER, // Referencia al ID de la tabla 'profesores' (NO 'usuarios'). Solo los profesores crean ejercicios.
    curso: DataTypes.INTEGER, // Curso al que pertenece esta actividad práctica
    nombre: DataTypes.TEXT, // Título de la actividad
    archivo: DataTypes.STRING, // Archivo adjunto con el enunciado o recursos necesarios
    descripcion: DataTypes.TEXT, // Instrucciones detalladas para el alumno
  },
  { timestamps: false },
);

module.exports = Ejercicios;
