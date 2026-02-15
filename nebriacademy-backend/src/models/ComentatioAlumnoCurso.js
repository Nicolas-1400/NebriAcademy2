const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// Modelo de ComentarioAlumnoCurso - Comentarios de alumnos en cursos
const ComentarioAlumnoCurso = sequelize.define(
  "comentarioalumnocurso",
  {
    usuarioId: DataTypes.INTEGER, // ID del usuario que hace el comentario
    cursoId: DataTypes.INTEGER, // ID del curso comentado
    comentario: DataTypes.TEXT, // Texto del comentario
  },
  { timestamps: false, tableName: "comentarioalumnocurso" },
);

module.exports = ComentarioAlumnoCurso;
