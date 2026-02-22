// ── IMPORTACIONES ───────────────────────────────────────────────────────────
// Importamos DataTypes para definir los tipos de columna y la conexión a la BDD
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ── MODELO ────────────────────────────────────────────────────────────────────
// Definimos el modelo "usuarios", que es la entidad base compartida por alumnos y profesores.
const Usuarios = sequelize.define(
  "usuarios",
  {
  // El campo tipo indica si el registro pertenece a un alumno o un profesor.
    tipo: {
      type: DataTypes.ENUM("alumno", "profesor"),
      allowNull: false,
    },
  },
  { timestamps: false },
);

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = Usuarios;
