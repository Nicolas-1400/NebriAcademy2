// ── IMPORTACIONES ───────────────────────────────────────────────────────────
// Importamos DataTypes para definir los tipos de columna y la conexión a la BDD
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ── MODELO ────────────────────────────────────────────────────────────────────
// Definimos el modelo "apuntes". El campo archivo guarda el nombre del fichero subido.
const Apuntes = sequelize.define(
  "apuntes",
  {
    autor: DataTypes.INTEGER,
    curso: DataTypes.INTEGER,
    categoria: DataTypes.ENUM(
      "Programación",
      "Diseño",
      "Ciberseguridad",
      "BDD",
      "Marketing",
    ),
    nombre: DataTypes.TEXT,
    archivo: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    // valoracion empieza en 0 y va cambiando según los likes que reciba el apunte.
    valoracion: { type: DataTypes.FLOAT, defaultValue: 0 },
  },
  { timestamps: false },
);

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = Apuntes;
