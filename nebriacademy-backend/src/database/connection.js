// Usamos Sequelize como ORM para conectar con la base de datos MySQL.
// Las credenciales se leen siempre desde las variables de entorno definidas en .env.
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    // SSL obligatorio para conectar con Aiven
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
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
