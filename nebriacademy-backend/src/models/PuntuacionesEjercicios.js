// ==========================================
// 1. IMPORTACIONES
// ==========================================
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ==========================================
// 2. DEFINICIÓN DEL MODELO
// ==========================================
// Libro de calificaciones. El profesor vuelca aquí el feedback y la nota numérica resultante de corregir una entrega.
const PuntuacionesEjercicios = sequelize.define(
  "puntuacionesejercicios",
  {
    ejercicioId: DataTypes.INTEGER,
    alumnoId: DataTypes.INTEGER,
    puntuacion: DataTypes.FLOAT,
  },
  { timestamps: false },
);

// ==========================================
// 3. EXPORTACIONES
// ==========================================
module.exports = PuntuacionesEjercicios;
