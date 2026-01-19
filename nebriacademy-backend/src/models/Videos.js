const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Videos = sequelize.define('videos', {
  autor: DataTypes.INTEGER,
  curso: DataTypes.INTEGER,
  duracion: DataTypes.INTEGER,
  valoracion: DataTypes.FLOAT
}, { timestamps: false });

module.exports = Videos;
