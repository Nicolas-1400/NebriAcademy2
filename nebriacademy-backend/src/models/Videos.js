const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Videos = sequelize.define('videos', {
  autor: DataTypes.INTEGER,
  curso: DataTypes.INTEGER,
  nombre: DataTypes.STRING,
  archivo: DataTypes.STRING,
}, { timestamps: false });

module.exports = Videos;
