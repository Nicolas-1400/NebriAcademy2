const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const EjerciciosAlumnos = sequelize.define('ejerciciosalumnos', {
  cursoId: DataTypes.INTEGER,
  alumnoId: DataTypes.INTEGER,
  archivo: DataTypes.STRING
}, { timestamps: false });

module.exports = EjerciciosAlumnos;
