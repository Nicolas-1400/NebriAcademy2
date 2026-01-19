const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Administradores = sequelize.define('administradores', {
  usuarioId: DataTypes.INTEGER,
  dni: { type: DataTypes.STRING, unique: true },
  nombre: DataTypes.STRING,
  apellidos: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  contrasena: DataTypes.STRING,
  numTelefono: DataTypes.STRING,
  redes: DataTypes.STRING,
  pais: DataTypes.STRING,
  localidad: DataTypes.STRING
}, { timestamps: false });


module.exports = Administradores;
