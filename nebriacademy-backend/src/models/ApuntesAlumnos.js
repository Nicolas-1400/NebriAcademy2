const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const ApuntesAlumnos = sequelize.define('apuntesalumnos', {
  apunteId: DataTypes.INTEGER,
  alumnoId: DataTypes.INTEGER,
  megusta: { type: DataTypes.BOOLEAN, allowNull: true }
}, { timestamps: false });

module.exports = ApuntesAlumnos;
