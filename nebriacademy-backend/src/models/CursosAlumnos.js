const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const CursosAlumnos = sequelize.define('cursosalumnos', {
  cursoId: DataTypes.INTEGER,
  alumnoId: DataTypes.INTEGER,
  favorito: DataTypes.BOOLEAN,
  apuntado: DataTypes.BOOLEAN,
  // map DB column "valoración" to JS attribute `valoracion` (boolean)
  valoracion: { type: DataTypes.BOOLEAN, field: 'valoración' },
  comentario: DataTypes.TEXT
}, { timestamps: false });

module.exports = CursosAlumnos;
