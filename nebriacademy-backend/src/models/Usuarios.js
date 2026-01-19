const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const Usuarios = sequelize.define('usuarios', {
  tipo: {
    type: DataTypes.ENUM('alumno', 'profesor', 'administrador'),
    allowNull: false
  }
}, { timestamps: false });


module.exports = Usuarios;