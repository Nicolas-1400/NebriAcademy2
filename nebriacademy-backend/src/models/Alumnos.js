const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// Modelo de Alumnos - Estudiantes registrados en la plataforma
const Alumnos = sequelize.define(
  "alumnos",
  {
    usuarioId: DataTypes.INTEGER, // Referencia al ID en la tabla usuarios
    dni: { type: DataTypes.STRING, unique: true }, // DNI único del alumno
    nombre: DataTypes.STRING, // Nombre del alumno
    apellidos: DataTypes.STRING, // Apellidos del alumno
    email: { type: DataTypes.STRING, unique: true }, // Email único para login
    contrasena: DataTypes.STRING, // Contraseña para autenticación
    numeroTarjeta: { type: DataTypes.STRING, unique: true }, // Número de tarjeta para pagos
    numTelefono: DataTypes.STRING, // Número de teléfono de contacto
    redes: DataTypes.TEXT, // Redes sociales o enlaces de contacto
    pais: DataTypes.STRING, // País de residencia
    localidad: DataTypes.STRING, // Ciudad o localidad
  },
  { timestamps: false },
);

module.exports = Alumnos;
