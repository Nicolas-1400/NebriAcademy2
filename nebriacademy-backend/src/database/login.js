// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();

// Importamos los modelos que necesitamos para buscar las credenciales
const Alumnos = require("../models/Alumnos.js");
const Profesores = require("../models/Profesores.js");

// POST /login/auth — Recibe email y contraseña y decide si el usuario es alumno o profesor
router.post("/auth", async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    console.log(`POST /login/auth - Email: ${email}`);

    // Ambos campos son obligatorios para continuar
    if (!email || !contrasena) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son requeridos" });
    }

    // Buscamos primero entre los alumnos; si coincide email y contraseña, respondemos con sus datos
    const alumnos = await Alumnos.findAll();
    const alumno = alumnos.find(
      (a) => a.email === email && a.contrasena === contrasena,
    );
    if (alumno) {
      return res.json({
        mensaje: "Login exitoso",
        tipo: "alumno",
        usuario: {
          id: alumno.id,
          usuarioId: alumno.usuarioId,
          dni: alumno.dni,
          nombre: alumno.nombre,
          apellidos: alumno.apellidos,
          email: alumno.email,
          numeroTarjeta: alumno.numeroTarjeta,
          numTelefono: alumno.numTelefono,
          redes: alumno.redes,
          pais: alumno.pais,
          localidad: alumno.localidad,
        },
      });
    }

    // Si no era alumno, buscamos entre los profesores con el mismo criterio
    const profesores = await Profesores.findAll();
    const profesor = profesores.find(
      (p) => p.email === email && p.contrasena === contrasena,
    );
    if (profesor) {
      return res.json({
        mensaje: "Login exitoso",
        tipo: "profesor",
        usuario: {
          id: profesor.id,
          usuarioId: profesor.usuarioId,
          dni: profesor.dni,
          nombre: profesor.nombre,
          apellidos: profesor.apellidos,
          email: profesor.email,
          numCuentaBancaria: profesor.numCuentaBancaria,
          numTelefono: profesor.numTelefono,
          redes: profesor.redes,
          pais: profesor.pais,
          localidad: profesor.localidad,
          especializacion: profesor.especializacion,
          imagenPerfil: profesor.imagenPerfil,
        },
      });
    }

    // Si no coincide con ningún registro, devolvemos error de credenciales incorrectas
    return res.status(401).json({ error: "Email o contraseña incorrectos" });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
