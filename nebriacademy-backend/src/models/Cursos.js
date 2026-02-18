const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Cursos = sequelize.define(
  "cursos",
  {
    nombreCurso: DataTypes.STRING,
    categoria: DataTypes.ENUM(
      "Programación",
      "Diseño",
      "Ciberseguridad",
      "BDD",
      "Marketing",
    ),
    profesor: DataTypes.INTEGER,
    nivel: DataTypes.STRING,
    valoracion: DataTypes.FLOAT,
    descripcion: DataTypes.TEXT,
    imagen: DataTypes.STRING,
  },
  { timestamps: false },
);

module.exports = Cursos;
