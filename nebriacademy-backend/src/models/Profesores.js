// ── IMPORTACIONES ───────────────────────────────────────────────────────────
// Importamos DataTypes para definir los tipos de columna y la conexión a la BDD
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ── MODELO ────────────────────────────────────────────────────────────────────
// Definimos el modelo "profesores". Además de los campos comunes, tiene especializacion (ENUM con valores fijos) e imagenPerfil
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
    // ENUM: solo acepta uno de estos valores concretos
    especializacion: DataTypes.ENUM(
      "Programación",
      "BDD",
      "Ciberseguridad",
      "Diseño y UX",
      "Inteligencia Artificial",
      "Marketing",
      "Desarrollo",
      "Data Science",
    ),
    imagenPerfil: DataTypes.STRING,
    alumnoVinculadoId: DataTypes.INTEGER,
  },
  { timestamps: false },
);

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = Profesores;
