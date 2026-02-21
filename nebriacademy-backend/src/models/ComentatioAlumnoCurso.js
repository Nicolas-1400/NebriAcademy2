// ==========================================
// 1. IMPORTACIONES
// ==========================================
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ==========================================
// 2. DEFINICIÓN DEL MODELO
// ==========================================
// Foro de reseñas. Permite a los usuarios plasmar sus opiniones y testimonios públicos sobre una cursada.
const ComentarioAlumnoCurso = sequelize.define(
  "comentarioalumnocurso",
  {
    usuarioId: DataTypes.INTEGER,
    cursoId: DataTypes.INTEGER,
    comentario: DataTypes.TEXT,
  },
  { timestamps: false, tableName: "comentarioalumnocurso" }, // No se toca que si no se rompe
);

// ==========================================
// 3. EXPORTACIONES
// ==========================================
module.exports = ComentarioAlumnoCurso;
