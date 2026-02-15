const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// Modelo de Usuarios - Tabla base para todos los tipos de usuarios (alumno, profesor, administrador)
const Usuarios = sequelize.define(
  "usuarios",
  {
    // Campo discriminador que define el rol y permisos del usuario en el sistema.
    // 'alumno': Acceso a cursos y contenidos.
    // 'profesor': Capacidad de crear cursos y corregir ejercicios.
    // 'administrador': Gestión global de la plataforma.
    tipo: {
      type: DataTypes.ENUM("alumno", "profesor", "administrador"),
      allowNull: false, // Este campo es obligatorio para determinar la lógica de acceso
    },
  },
  { timestamps: false },
);

module.exports = Usuarios;
