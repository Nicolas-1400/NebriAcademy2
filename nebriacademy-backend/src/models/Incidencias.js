// ==========================================
// 1. IMPORTACIONES
// ==========================================
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ==========================================
// 2. DEFINICIÓN DEL MODELO
// ==========================================
// Buzón de soporte técnico. Recaba los partes de error o peticiones de ayuda que los usuarios emiten hacia la administración.
const Incidencias = sequelize.define(
  "incidencias",
  {
    tipo: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    resuelto: DataTypes.BOOLEAN,
    usuario: DataTypes.INTEGER,
  },
  { timestamps: false },
);

// ==========================================
// 3. EXPORTACIONES
// ==========================================
module.exports = Incidencias;
