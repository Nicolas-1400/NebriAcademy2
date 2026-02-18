const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const ComentarioAlumnoCurso = sequelize.define(
  "comentarioalumnocurso",
  {
    usuarioId: DataTypes.INTEGER,
    cursoId: DataTypes.INTEGER,
    comentario: DataTypes.TEXT,
  },
  { timestamps: false, tableName: "comentarioalumnocurso" }, // No se toca que si no se rompe
);

module.exports = ComentarioAlumnoCurso;
