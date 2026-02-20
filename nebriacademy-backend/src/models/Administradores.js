// ==========================================
// 1. IMPORTACIONES
// ==========================================
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ==========================================
// 2. DEFINICIÓN DEL MODELO
// ==========================================
// Modelo de máxima jerarquía. Coordina el acceso sin restricciones al panel de control de la academia.
const Administradores = sequelize.define(
  "administradores",
  {
    usuarioId: DataTypes.INTEGER,
    dni: { type: DataTypes.STRING, unique: true },
    nombre: DataTypes.STRING,
    apellidos: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    contrasena: DataTypes.STRING,
    numTelefono: DataTypes.STRING,
    redes: DataTypes.STRING,
    pais: DataTypes.STRING,
    localidad: DataTypes.STRING,
  },
  { timestamps: false },
);

// ==========================================
// 3. EXPORTACIONES
// ==========================================
module.exports = Administradores;
