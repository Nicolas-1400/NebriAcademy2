// ==========================================
// 1. IMPORTACIONES
// ==========================================
const express = require("express");
const router = express.Router();

// ==========================================
// 2. RUTAS DE OBTENCIÓN (GET)
// ==========================================
// Devuelve un template string HTML listando los endpoints activos.
router.get("/", (req, res) => {
  res.send(`
    <h1>API NebriAcademy</h1>
    <p>Endpoints disponibles:</p>
    <ul>
      <li>/administradores</li>
      <li>/alumnos</li>
      <li>/apuntes</li>
      <li>/cursos</li>
      <li>/ejercicios</li>
      <li>/incidencias</li>
      <li>/profesores</li>
      <li>/usuarios</li>
      <li>/videos</li>
    </ul>
  `);
});

// ==========================================
// 3. EXPORTACIONES
// ==========================================
module.exports = router;
