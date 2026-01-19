const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Ejercicios = sequelize.define('ejercicios', {
  autor: DataTypes.INTEGER,
  curso: DataTypes.INTEGER,
  valoracion: DataTypes.FLOAT
}, { timestamps: false });


module.exports = Ejercicios;
