const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const ProfesoresCursos = sequelize.define('profesorescursos', {
  profesorId: DataTypes.INTEGER,
  cursoId: DataTypes.INTEGER
}, { timestamps: false });

module.exports = ProfesoresCursos;
