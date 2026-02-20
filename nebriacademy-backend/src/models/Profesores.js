// ==========================================
// 1. IMPORTACIONES
// ==========================================
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ==========================================
// 2. DEFINICIÓN DEL MODELO
// ==========================================
// Perfil detallado del docente. Guarda su especialización, biografía pública y medios de contacto (Redes).
const Profesores = sequelize.define(
  "profesores",
  {
    usuarioId: DataTypes.INTEGER,
    dni: { type: DataTypes.STRING, unique: true },
    nombre: DataTypes.STRING,
    apellidos: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    contrasena: DataTypes.STRING,
    numCuentaBancaria: { type: DataTypes.STRING, unique: true },
    numTelefono: DataTypes.STRING,
    redes: DataTypes.TEXT,
    pais: DataTypes.STRING,
    localidad: DataTypes.STRING,
    especializacion: DataTypes.ENUM(
      "Programación",
      "Diseño",
      "Ciberseguridad",
      "BDD",
      "Marketing",
    ),
    imagenPerfil: DataTypes.STRING,
  },
  { timestamps: false },
);

// ==========================================
// 3. EXPORTACIONES
// ==========================================
module.exports = Profesores;
