const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// Modelo de EjerciciosAlumnos - Entregas de ejercicios por parte de los alumnos
const EjerciciosAlumnos = sequelize.define(
  "ejerciciosalumnos",
  {
    ejercicioId: DataTypes.INTEGER, // ID del ejercicio
    alumnoId: DataTypes.INTEGER, // ID del alumno que entrega
    archivo: DataTypes.STRING, // Ruta del archivo entregado por el alumno
  },
  { timestamps: false },
);

module.exports = EjerciciosAlumnos;
