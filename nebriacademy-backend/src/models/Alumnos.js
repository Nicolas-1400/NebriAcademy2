const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Alumnos = sequelize.define('alumnos', {
  usuarioId: DataTypes.INTEGER,
  dni: { type: DataTypes.STRING, unique: true },
  nombre: DataTypes.STRING,
  apellidos: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  contrasena: DataTypes.STRING,
  numeroTarjeta: { type: DataTypes.STRING, unique: true },
  numTelefono: DataTypes.STRING,
  redes: DataTypes.TEXT,
  pais: DataTypes.STRING,
  localidad: DataTypes.STRING
}, { timestamps: false });

module.exports = Alumnos;
