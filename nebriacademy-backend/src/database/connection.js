// Usamos Sequelize como ORM para conectar con la base de datos MySQL
const { Sequelize } = require("sequelize");

// En producción (Railway) se usan variables de entorno DB_*.
// En local se mantienen los valores por defecto (root / sin contraseña / localhost).
const sequelize = new Sequelize(
  process.env.DB_NAME || "nebriacademy",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  }
);

// Verificamos que la conexión es correcta al arrancar la aplicación
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión establecida correctamente.");
  })
  .catch((error) => {
    console.error("No se pudo conectar a la base de datos.", error);
  });

// Exportamos la instancia para que los modelos puedan utilizarla
module.exports = sequelize;
