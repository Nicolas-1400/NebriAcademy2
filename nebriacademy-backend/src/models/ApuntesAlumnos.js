// ── IMPORTACIONES ───────────────────────────────────────────────────────────
// Importamos DataTypes para definir los tipos de columna y la conexión a la BDD
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ── MODELO ────────────────────────────────────────────────────────────────────
// Tabla intermedia entre apuntes y alumnos. El campo megusta registra si el alumno ha dado like al apunte (null = sin voto)
const ApuntesAlumnos = sequelize.define(
  "apuntesalumnos",
  {
    apunteId: DataTypes.INTEGER,
    alumnoId: DataTypes.INTEGER,
    megusta: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  { timestamps: false },
);

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = ApuntesAlumnos;
