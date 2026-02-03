const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Ejercicios = sequelize.define('ejercicios', {
  autor: DataTypes.INTEGER,
  curso: DataTypes.INTEGER,
  nombre: DataTypes.STRING,
  archivo: DataTypes.STRING,
}, { timestamps: false });

module.exports = Ejercicios;
