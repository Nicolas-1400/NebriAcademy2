const express = require("express");
const router = express.Router();

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

module.exports = router;
