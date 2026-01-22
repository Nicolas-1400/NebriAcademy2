const express = require("express");
const router = express.Router();
const Usuarios = require("../models/Usuarios.js");
const Alumnos = require("../models/Alumnos.js");

// Registrar un nuevo usuario (alumno)
router.post("/auth", (req, res) => {
  try {
    const { nombre, apellidos, dni, email, contrasena } = req.body;
    console.log(`POST /registerAlumnoExterno/auth - Email: ${email}`);

    if (!nombre || !apellidos || !dni || !email || !contrasena) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Verificar si el email ya existe
    Alumnos.findAll().then((alumnos) => {
      const usuarioExistente = alumnos.find((a) => a.email === email);
      if (usuarioExistente) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }

      // Crear nuevo usuario en tabla usuarios
      Usuarios.create({
        tipo: "alumno"
      }).then((nuevoUsuario) => {
        // Crear nuevo alumno con el usuarioId
        Alumnos.create({
          usuarioId: nuevoUsuario.id,
          nombre: nombre,
          apellidos: apellidos,
          dni: dni,
          email: email,
          contrasena: contrasena
        }).then((nuevoAlumno) => {
          res.status(201).json({
            mensaje: "Registro exitoso",
            usuario: {
              id: nuevoAlumno.id,
              nombre: nuevoAlumno.nombre,
              apellidos: nuevoAlumno.apellidos,
              dni: nuevoAlumno.dni,
              email: nuevoAlumno.email
            }
          });
        }).catch((error) => {
          console.error("Error al crear alumno:", error);
          // Eliminar el usuario si falla la creación del alumno
          nuevoUsuario.destroy();
          res.status(500).json({ error: "Error al crear el usuario" });
        });
      }).catch((error) => {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: "Error al crear el usuario" });
      });
    }).catch((error) => {
      console.error("Error al verificar email:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
