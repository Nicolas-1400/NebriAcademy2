const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// Modelo de PuntuacionesEjercicios - Calificaciones de ejercicios entregados por alumnos
const PuntuacionesEjercicios = sequelize.define(
  "puntuacionesejercicios",
  {
    ejercicioId: DataTypes.INTEGER, // ID del ejercicio
    alumnoId: DataTypes.INTEGER, // ID del alumno
    puntuacion: DataTypes.FLOAT, // Calificación numérica del ejercicio
  },
  { timestamps: false },
);

module.exports = PuntuacionesEjercicios;
