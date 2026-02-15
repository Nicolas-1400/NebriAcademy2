const { Sequelize } = require("sequelize");

// Configuración de la instancia de Sequelize para conectar con MySQL
// Base de datos: nebriacademy, Usuario: root, Sin contraseña, Host: localhost
const sequelize = new Sequelize("nebriacademy", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// Verificar la conexión a la base de datos al iniciar la aplicación
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión establecida correctamente.");
  })
  .catch((error) => {
    console.error("No se pudo conectar a la base de datos.", error);
  });

module.exports = sequelize;
