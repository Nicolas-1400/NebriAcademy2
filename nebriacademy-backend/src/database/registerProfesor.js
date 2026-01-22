const express = require("express");
const router = express.Router();
const Usuarios = require("../models/Usuarios.js");
const Profesores = require("../models/Profesores.js");

// Registrar un nuevo usuario (profesor)
router.post("/auth", (req, res) => {
  try {
    const { nombre, apellidos, dni, email, contrasena, numeroTarjeta, pais, localidad } = req.body;
    console.log(`POST /registerProfesor/auth - Email: ${email}`);

    if (!nombre || !apellidos || !dni || !email || !contrasena || !numeroTarjeta || !pais || !localidad) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Verificar si el email ya existe
    Profesores.findAll().then((profesores) => {
      const usuarioExistente = profesores.find((a) => a.email === email);
      if (usuarioExistente) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }

      // Crear nuevo usuario en tabla usuarios con tipo profesor
      Usuarios.create({
        tipo: "profesor"
      }).then((nuevoUsuario) => {
        // Crear nuevo profesor con el usuarioId
        Profesores.create({
          usuarioId: nuevoUsuario.id,
          nombre: nombre,
          apellidos: apellidos,
          dni: dni,
          email: email,
          contrasena: contrasena,
          numCuentaBancaria: numeroTarjeta,
          pais: pais,
          localidad: localidad
        }).then((nuevoProfesor) => {
          res.status(201).json({
            mensaje: "Registro exitoso",
            usuario: {
              id: nuevoProfesor.id,
              nombre: nuevoProfesor.nombre,
              apellidos: nuevoProfesor.apellidos,
              dni: nuevoProfesor.dni,
              email: nuevoProfesor.email
            }
          });
        }).catch((error) => {
          console.error("Error al crear profesor:", error);
          // Eliminar el usuario si falla la creación del profesor
          nuevoUsuario.destroy();
          res.status(500).json({ error: "Error al crear el profesor" });
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
