const { Sequelize } = require("sequelize");

// Configuración de la Conexión
const sequelize = new Sequelize("nebriacademy", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// Verificación de la Conexión
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión establecida correctamente.");
  })
  .catch((error) => {
    console.error("No se pudo conectar a la base de datos.", error);
  });

module.exports = sequelize;
