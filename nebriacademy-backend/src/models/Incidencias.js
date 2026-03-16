// ── IMPORTACIONES ───────────────────────────────────────────────────────────
// Importamos DataTypes para definir los tipos de columna y la conexión a la BDD
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

// ── MODELO ────────────────────────────────────────────────────────────────────
// Tabla que almacena las incidencias que los usuarios reportan al administrador.
// El campo "resuelto" indica si la incidencia ha sido atendida o sigue pendiente.
const Incidencias = sequelize.define(
  "incidencias",
  {
    usuario: DataTypes.INTEGER,
    tipo: DataTypes.ENUM(
      "Error", 
      "Denuncia", 
      "Consulta", 
      "Sugerencia",
    ),
    descripcion: DataTypes.TEXT,
    archivo: DataTypes.STRING,
    resuelto: DataTypes.BOOLEAN,
  },
  { timestamps: false },
);

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = Incidencias;
