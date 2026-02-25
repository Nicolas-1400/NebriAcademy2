// ── IMPORTACIONES ───────────────────────────────────────────────────────────
// Importamos DataTypes para definir los tipos de columna y la conexión a la BDD
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ── MODELO ────────────────────────────────────────────────────────────────────
// Tabla intermedia que registra la relación alumno-curso: si está apuntado, si lo tiene en favoritos y si lo ha valorado
const CursosAlumnos = sequelize.define(
  "cursosalumnos",
  {
    cursoId: DataTypes.INTEGER,
    alumnoId: DataTypes.INTEGER,
    favorito: DataTypes.BOOLEAN,
    apuntado: DataTypes.BOOLEAN,
    // field: "valoración" indica el nombre real de la columna en la BDD (con tilde)
    valoracion: { type: DataTypes.BOOLEAN },
  },
  { timestamps: false },
);

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = CursosAlumnos;
