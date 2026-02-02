const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const CursosAlumnos = sequelize.define('cursosalumnos', {
  cursoId: DataTypes.INTEGER,
  alumnoId: DataTypes.INTEGER,
  favorito: DataTypes.BOOLEAN,
  apuntado: DataTypes.BOOLEAN,
  valoracion: { type: DataTypes.BOOLEAN, field: 'valoración' }
}, { timestamps: false });

module.exports = CursosAlumnos;
