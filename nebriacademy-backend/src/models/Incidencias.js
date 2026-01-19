const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Incidencias = sequelize.define('incidencias', {
  tipo: DataTypes.STRING,
  descripcion: DataTypes.TEXT,
  resuelto: DataTypes.BOOLEAN,
  usuario: DataTypes.INTEGER
}, { timestamps: false });


module.exports = Incidencias;
