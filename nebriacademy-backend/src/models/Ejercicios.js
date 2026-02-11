const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Ejercicios = sequelize.define('ejercicios', {
  autor: DataTypes.INTEGER,
  curso: DataTypes.INTEGER,
  nombre: DataTypes.TEXT,
  archivo: DataTypes.STRING,
  descripcion: DataTypes.TEXT
}, { timestamps: false });

module.exports = Ejercicios;
