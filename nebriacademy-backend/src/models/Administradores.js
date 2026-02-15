const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// Modelo de Administradores - Usuarios con permisos administrativos en la plataforma
const Administradores = sequelize.define(
  "administradores",
  {
    usuarioId: DataTypes.INTEGER, // Referencia al ID en la tabla usuarios
    dni: { type: DataTypes.STRING, unique: true }, // DNI único del administrador
    nombre: DataTypes.STRING, // Nombre del administrador
    apellidos: DataTypes.STRING, // Apellidos del administrador
    email: { type: DataTypes.STRING, unique: true }, // Email único para login
    contrasena: DataTypes.STRING, // Contraseña para autenticación
    numTelefono: DataTypes.STRING, // Número de teléfono de contacto
    redes: DataTypes.STRING, // Redes sociales o enlaces de contacto
    pais: DataTypes.STRING, // País de residencia
    localidad: DataTypes.STRING, // Ciudad o localidad
  },
  { timestamps: false },
);

module.exports = Administradores;
