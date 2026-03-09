// ── IMPORTACIONES ───────────────────────────────────────────────────────────
// Importamos DataTypes para definir los tipos de columna y la conexión a la BDD
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ── MODELO ────────────────────────────────────────────────────────────────────
// Definimos el modelo "administradores". Comparte campos comunes con alumnos y profesores
// pero sin datos específicos de alumno (tarjeta) ni de profesor (cuenta bancaria, especialización).
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

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = Administradores;
