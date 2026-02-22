// ── IMPORTACIONES ───────────────────────────────────────────────────────────
// Importamos DataTypes para definir los tipos de columna y la conexión a la BDD
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ── MODELO ────────────────────────────────────────────────────────────────────
// Tabla que almacena la nota que el profesor pone a la entrega de un alumno en un ejercicio concreto
const PuntuacionesEjercicios = sequelize.define(
  "puntuacionesejercicios",
  {
    ejercicioId: DataTypes.INTEGER,
    alumnoId: DataTypes.INTEGER,
    puntuacion: DataTypes.FLOAT,
  },
  { timestamps: false },
);

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = PuntuacionesEjercicios;
