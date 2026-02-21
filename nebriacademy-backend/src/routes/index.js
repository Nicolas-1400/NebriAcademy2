// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();

// ── GET ─────────────────────────────────────────────────────────────────────
// GET / — Devuelve una página HTML básica listando los endpoints disponibles de la API
router.get("/", (req, res) => {
  res.send(`
    <h1>API NebriAcademy</h1>
    <p>Endpoints disponibles:</p>
    <ul>
      <li>/alumnos</li>
      <li>/apuntes</li>
      <li>/cursos</li>
      <li>/ejercicios</li>
      <li>/profesores</li>
      <li>/usuarios</li>
      <li>/videos</li>
    </ul>
  `);
});

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
