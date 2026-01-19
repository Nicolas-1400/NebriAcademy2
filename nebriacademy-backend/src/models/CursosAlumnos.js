const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const CursosAlumnos = sequelize.define('cursosalumnos', {
  cursoId: DataTypes.INTEGER,
  alumnoId: DataTypes.INTEGER
}, { timestamps: false });

module.exports = CursosAlumnos;
