const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Profesores = sequelize.define('profesores', {
  usuarioId: DataTypes.INTEGER,
  dni: { type: DataTypes.STRING, unique: true },
  nombre: DataTypes.STRING,
  apellidos: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  contrasena: DataTypes.STRING,
  numCuentaBancaria: { type: DataTypes.STRING, unique: true },
  numTelefono: DataTypes.STRING,
  redes: DataTypes.TEXT,
  pais: DataTypes.STRING,
  localidad: DataTypes.STRING,
  especializacion: DataTypes.STRING
}, { timestamps: false });

module.exports = Profesores;
