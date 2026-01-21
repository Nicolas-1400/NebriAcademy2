const express = require("express");
const router = express.Router();
const Administradores = require("../models/Administradores.js");
const Alumnos = require("../models/Alumnos.js");
const Profesores = require("../models/Profesores.js");

// Login de usuario
router.post("/auth", (req, res) => {
  try {
    const { email, contrasena } = req.body;
    console.log(`POST /login/auth - Email: ${email}`);

    if (!email || !contrasena) {
      return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    // Buscar en administradores
    Administradores.findAll()
      .then((admins) => {
        const admin = admins.find((a) => a.email === email && a.contrasena === contrasena);
        if (admin) {
          return res.json({
            mensaje: "Login exitoso",
            tipo: "administrador",
            usuario: {
              id: admin.id,
              usuarioId: admin.usuarioId,
              nombre: admin.nombre,
              apellidos: admin.apellidos,
              email: admin.email
            }
          });
        }

        // Buscar en alumnos
        return Alumnos.findAll().then((alumnos) => {
          const alumno = alumnos.find((a) => a.email === email && a.contrasena === contrasena);
          if (alumno) {
            return res.json({
              mensaje: "Login exitoso",
              tipo: "alumno",
              usuario: {
                id: alumno.id,
                usuarioId: alumno.usuarioId,
                nombre: alumno.nombre,
                apellidos: alumno.apellidos,
                email: alumno.email
              }
            });
          }

          // Buscar en profesores
          return Profesores.findAll().then((profesores) => {
            const profesor = profesores.find((p) => p.email === email && p.contrasena === contrasena);
            if (profesor) {
              return res.json({
                mensaje: "Login exitoso",
                tipo: "profesor",
                usuario: {
                  id: profesor.id,
                  usuarioId: profesor.usuarioId,
                  nombre: profesor.nombre,
                  apellidos: profesor.apellidos,
                  email: profesor.email
                }
              });
            }

            return res.status(401).json({ error: "Email o contraseña incorrectos" });
          });
        });
      })
      .catch((error) => {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
      });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
