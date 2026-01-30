const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Videos = sequelize.define('videos', {
  autor: DataTypes.INTEGER,
  curso: DataTypes.INTEGER,
  nombre: DataTypes.STRING,
  archivo: DataTypes.STRING,
  valoracion: { type: DataTypes.FLOAT, defaultValue: 0 }
}, { timestamps: false });

module.exports = Videos;
