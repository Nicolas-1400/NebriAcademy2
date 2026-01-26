const express = require("express");
const router = express.Router();
const Usuarios = require("../models/Usuarios.js");
const Alumnos = require("../models/Alumnos.js");

// Verificar email de Nebrija y crear usuario
router.post("/auth", (req, res) => {
  try {
    const { email } = req.body;
    console.log(`POST /verificacionnebrija/auth - Email: ${email}`);

    if (!email) {
      return res.status(400).json({ error: "El email es requerido" });
    }

    // Validar que el email termine en @alumnos.nebrija.es
    if (!email.endsWith("@alumnos.nebrija.es")) {
      return res.status(400).json({ error: "Ese correo no pertenece a la familia Nebrija" });
    }

    // Verificar si el email ya existe en alumnos
    Alumnos.findAll().then((alumnos) => {
      const usuarioExistente = alumnos.find((a) => a.email === email);
      if (usuarioExistente) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }

      // Crear nuevo usuario en tabla usuarios
      Usuarios.create({
        tipo: "alumno"
      }).then((nuevoUsuario) => {
        // Crear nuevo alumno en tabla alumnos
        Alumnos.create({
          usuarioId: nuevoUsuario.id,
          email: email
        }).then((nuevoAlumno) => {
          res.status(201).json({
            mensaje: "Verificación exitosa",
            usuarioId: nuevoUsuario.id,
            alumnoId: nuevoAlumno.id,
            email: nuevoAlumno.email
          });
        }).catch((error) => {
          console.error("Error al crear alumno:", error);
          // Eliminar el usuario creado si falla la creación del alumno
          nuevoUsuario.destroy();
          res.status(500).json({ error: "Error al crear el alumno" });
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
    console.error("Error en verificación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Completar registro del alumno Nebrija
router.post("/completar", (req, res) => {
  try {
    const { alumnoId, nombre, apellidos, dni, contrasena, pais, localidad } = req.body;
    console.log(`POST /verificacionnebrija/completar - AlumnoId: ${alumnoId}`);

    if (!alumnoId || !nombre || !apellidos || !dni || !contrasena || !pais || !localidad) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Actualizar el alumno con los datos proporcionados
    Alumnos.findAll().then((alumnos) => {
      const alumno = alumnos.find((a) => a.id === parseInt(alumnoId));
      if (!alumno) {
        return res.status(404).json({ error: "Alumno no encontrado" });
      }

      alumno.update({
        nombre: nombre,
        apellidos: apellidos,
        dni: dni,
        contrasena: contrasena,
        pais: pais,
        localidad: localidad
      }).then((alumnoActualizado) => {
        res.status(200).json({
          mensaje: "Registro completado exitosamente",
          usuario: {
            id: alumnoActualizado.id,
            nombre: alumnoActualizado.nombre,
            apellidos: alumnoActualizado.apellidos,
            email: alumnoActualizado.email,
            dni: alumnoActualizado.dni,
            pais: alumnoActualizado.pais,
            localidad: alumnoActualizado.localidad
          }
        });
      }).catch((error) => {
        console.error("Error al actualizar alumno:", error);
        res.status(500).json({ error: "Error al actualizar el usuario" });
      });
    }).catch((error) => {
      console.error("Error al buscar alumno:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    });
  } catch (error) {
    console.error("Error en completar registro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;