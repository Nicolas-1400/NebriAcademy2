// ── IMPORTACIONES ───────────────────────────────────────────────────────────
// Importamos DataTypes para definir los tipos de columna y la conexión a la BDD
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ── MODELO ────────────────────────────────────────────────────────────────────
// Definimos el modelo "alumnos", que mapea a la tabla del mismo nombre en la BDD.
const Alumnos = sequelize.define(
  "alumnos",
  {
    usuarioId: DataTypes.INTEGER,
    // unique: true impide valores duplicados en ese campo.
    dni: { type: DataTypes.STRING, unique: true },
    nombre: DataTypes.STRING,
    apellidos: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    contrasena: DataTypes.STRING,
    numeroTarjeta: { type: DataTypes.STRING, unique: true },
    numTelefono: DataTypes.STRING,
    redes: DataTypes.TEXT,
    pais: DataTypes.STRING,
    localidad: DataTypes.STRING,
  },
  // timestamps: false evita que Sequelize añada columnas de fecha automáticas.
  { timestamps: false },
);

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = Alumnos;
