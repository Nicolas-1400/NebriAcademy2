const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Apuntes = sequelize.define('apuntes', {
  autor: DataTypes.INTEGER,
  curso: DataTypes.INTEGER,
  contenido: DataTypes.TEXT,
  valoracion: DataTypes.FLOAT
}, { timestamps: false });

module.exports = Apuntes;
