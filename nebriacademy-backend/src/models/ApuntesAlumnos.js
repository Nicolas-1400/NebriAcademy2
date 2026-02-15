const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// Modelo de ApuntesAlumnos - Relación entre apuntes y alumnos (me gusta)
const ApuntesAlumnos = sequelize.define(
  "apuntesalumnos",
  {
    apunteId: DataTypes.INTEGER, // ID del apunte
    alumnoId: DataTypes.INTEGER, // ID del alumno
    megusta: { type: DataTypes.BOOLEAN, allowNull: true }, // Indica si al alumno le gusta el apunte
  },
  { timestamps: false },
);

module.exports = ApuntesAlumnos;
