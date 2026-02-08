const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Apuntes = sequelize.define('apuntes', {
  autor: DataTypes.INTEGER,
  curso: DataTypes.INTEGER,
  nombre: DataTypes.TEXT,
  archivo: DataTypes.STRING,
  descripcion: DataTypes.TEXT,
  valoracion: { type: DataTypes.FLOAT, defaultValue: 0 }

}, { timestamps: false });

module.exports = Apuntes;
