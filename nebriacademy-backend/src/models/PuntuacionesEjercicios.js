const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const PuntuacionesEjercicios = sequelize.define('puntuacionesejercicios', {
  ejercicioId: DataTypes.INTEGER,
  alumnoId: DataTypes.INTEGER,
  puntuacion: DataTypes.FLOAT
}, { timestamps: false });

module.exports = PuntuacionesEjercicios;