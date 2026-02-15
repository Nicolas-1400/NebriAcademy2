const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// Modelo de Profesores - Profesores que imparten cursos en la plataforma
const Profesores = sequelize.define(
  "profesores",
  {
    usuarioId: DataTypes.INTEGER, // Clave foránea que vincula este perfil con la tabla de autenticación 'Usuarios'
    dni: { type: DataTypes.STRING, unique: true }, // Documento Nacional de Identidad (DNI) único
    nombre: DataTypes.STRING, // Nombre de pila
    apellidos: DataTypes.STRING, // Apellidos completos
    email: { type: DataTypes.STRING, unique: true }, // Correo electrónico corporativo (debe ser único)
    contrasena: DataTypes.STRING, // Hash de la contraseña (por seguridad nunca se debe guardar en texto plano)
    numCuentaBancaria: { type: DataTypes.STRING, unique: true }, // IBAN para la gestión de nóminas
    numTelefono: DataTypes.STRING, // Teléfono de contacto profesional
    redes: DataTypes.TEXT, // JSON o String con enlaces a redes sociales (LinkedIn, GitHub, etc.)
    pais: DataTypes.STRING, // País de residencia fiscal
    localidad: DataTypes.STRING, // Ciudad o municipio
    especializacion: DataTypes.ENUM(
      "Programación",
      "Diseño",
      "Ciberseguridad",
      "BDD",
      "Marketing",
    ), // Área técnica principal del docente
  },
  { timestamps: false },
);

module.exports = Profesores;
