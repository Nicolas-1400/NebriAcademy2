const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// Modelo de Incidencias - Reportes de problemas o incidencias en la plataforma
const Incidencias = sequelize.define(
  "incidencias",
  {
    tipo: DataTypes.STRING, // Tipo de incidencia
    descripcion: DataTypes.TEXT, // Descripción detallada de la incidencia
    resuelto: DataTypes.BOOLEAN, // Indica si la incidencia ha sido resuelta
    usuario: DataTypes.INTEGER, // ID del usuario que reportó la incidencia
  },
  { timestamps: false },
);

module.exports = Incidencias;
