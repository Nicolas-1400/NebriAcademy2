// Usamos Sequelize como ORM para conectar con la base de datos MySQL
const { Sequelize } = require("sequelize");

// Creamos la instancia de conexión con el nombre de la BDD, usuario y contraseña
const sequelize = new Sequelize("nebriacademy", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

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
