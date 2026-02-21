// ── IMPORTACIONES ───────────────────────────────────────────────────────────
// Importamos DataTypes para definir los tipos de columna y la conexión a la BD
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ── MODELO ────────────────────────────────────────────────────────────────────
// Tabla que guarda los comentarios que los usuarios publican en un curso concreto
const ComentarioAlumnoCurso = sequelize.define(
  "comentarioalumnocurso",
  {
    usuarioId: DataTypes.INTEGER,
    cursoId: DataTypes.INTEGER,
    comentario: DataTypes.TEXT,
  },
  { timestamps: false, tableName: "comentarioalumnocurso" },
);

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = ComentarioAlumnoCurso;
