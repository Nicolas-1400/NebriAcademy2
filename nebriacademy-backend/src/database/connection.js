// ==========================================
// 1. IMPORTACIONES
// ==========================================
const { Sequelize } = require("sequelize");

// ==========================================
// 2. CONFIGURACIÓN DEL ORM
// ==========================================
// Instanciación de Sequelize vinculada a la base de datos MySQL local "nebriacademy"
const sequelize = new Sequelize("nebriacademy", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// ==========================================
// 3. PRUEBA DE CONECTIVIDAD
// ==========================================
// Intento asíncrono preliminar para asegurar que la BDD responde antes de empezar a servir
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión establecida correctamente.");
  })
  .catch((error) => {
    console.error("No se pudo conectar a la base de datos.", error);
  });

module.exports = sequelize;
