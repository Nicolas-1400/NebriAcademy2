// ── IMPORTACIONES ───────────────────────────────────────────────────────────
// Importamos DataTypes para definir los tipos de columna y la conexión a la BDD
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ── MODELO ────────────────────────────────────────────────────────────────────
// Definimos el modelo "notificaciones", que avisa al usuario de interacciones nuevas.
const Notificaciones = sequelize.define(
  "notificaciones",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipoUsuario: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Si es profesor, alumno, o administrador al que pertenece la notificación",
    },
    mensaje: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    enlace: {
      type: DataTypes.STRING,
      allowNull: true, // URL parcial hacia donde debe ir (ej. /Home/Cursos/3)
    },
    vista: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false },
);

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = Notificaciones;
