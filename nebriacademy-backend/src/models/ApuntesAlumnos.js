// ==========================================
// 1. IMPORTACIONES
// ==========================================
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ==========================================
// 2. DEFINICIÓN DEL MODELO
// ==========================================
// Tabla N:M para trazar las interacciones analíticas (visitas, descargas, likes) de los estudiantes con los apuntes.
const ApuntesAlumnos = sequelize.define(
  "apuntesalumnos",
  {
    apunteId: DataTypes.INTEGER,
    alumnoId: DataTypes.INTEGER,
    megusta: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  { timestamps: false },
);

// ==========================================
// 3. EXPORTACIONES
// ==========================================
module.exports = ApuntesAlumnos;
