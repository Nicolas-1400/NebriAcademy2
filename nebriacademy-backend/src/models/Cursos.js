// ── IMPORTACIONES ───────────────────────────────────────────────────────────
// Importamos DataTypes para definir los tipos de columna y la conexión a la BDD
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ── MODELO ────────────────────────────────────────────────────────────────────
// Definimos el modelo "cursos". El campo categoria usa ENUM para limitar los valores posibles.
// El campo imagen almacena el nombre del archivo de portada del curso.
const Cursos = sequelize.define(
  "cursos",
  {
    nombreCurso: DataTypes.STRING,
    categoria: DataTypes.ENUM(
      "Programación",
      "Diseño",
      "Ciberseguridad",
      "BDD",
      "Marketing",
    ),
    profesor: DataTypes.INTEGER,
    nivel: DataTypes.STRING,
    valoracion: DataTypes.FLOAT,
    descripcion: DataTypes.TEXT,
    imagen: DataTypes.STRING,
  },
  { timestamps: false },
);

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = Cursos;
