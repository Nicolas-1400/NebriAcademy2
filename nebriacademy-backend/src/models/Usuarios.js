// ==========================================
// 1. IMPORTACIONES
// ==========================================
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ==========================================
// 2. DEFINICIÓN DEL MODELO
// ==========================================
// Tabla maestra genérica. Concede el ID universal y abstrae el rol del usuario antes de derivarlo a tablas específicas.
const Usuarios = sequelize.define(
  "usuarios",
  {
    tipo: {
      type: DataTypes.ENUM("alumno", "profesor", "administrador"),
      allowNull: false,
    },
  },
  { timestamps: false },
);

// ==========================================
// 3. EXPORTACIONES
// ==========================================
module.exports = Usuarios;
