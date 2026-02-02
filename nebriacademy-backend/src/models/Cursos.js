const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Cursos = sequelize.define('cursos', {
  nombreCurso: DataTypes.STRING,
  categoria: DataTypes.STRING,
  profesor: DataTypes.INTEGER,
  nivel: DataTypes.STRING,
  valoracion: DataTypes.FLOAT,
  descripcion: DataTypes.TEXT
}, { timestamps: false });

module.exports = Cursos;
