const express = require("express");
const router = express.Router();
const Profesores = require("../models/Profesores.js");
const Usuarios = require("../models/Usuarios.js");

// Obtener todos los profesores (incluye enum 'especializacion')
router.get("/", (req, res) => {
  try {
    console.log("GET /profesores");
    Profesores.findAll().then((resultado) => {
      res.json({ "Numero de profesores": resultado.length, Profesores: resultado });
    });
  } catch (error) {
    console.error("Error al obtener profesores:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Endpoint simple para devolver valores del enum 'especializacion' de Profesores
router.get('/especializaciones', (req, res) => {
  try {
    const vals = (Profesores.rawAttributes && Profesores.rawAttributes.especializacion && Profesores.rawAttributes.especializacion.values) || [];
    res.json({ especializaciones: vals });
  } catch (e) {
    console.error('Error devolviendo especializaciones Profesores:', e);
    res.status(500).json({ especializaciones: [] });
  }
});

// Obtener por ID un profesor
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`GET /profesores/${id}`);
    Profesores.findAll().then((resultado) => {
      const profesor = resultado.find((p) => p.id === id);
      if (profesor) {
        res.json(profesor);
      } else {
        res.status(404).json({ error: "Profesor no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al obtener profesor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar un profesor por ID
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`PUT /profesores/${id}`);
    Profesores.findAll().then((resultado) => {
      const profesor = resultado.find((p) => p.id === id);
      if (profesor) {
        profesor.update(req.body).then((actualizado) => res.json(actualizado));
      } else {
        res.status(404).json({ error: "Profesor no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al actualizar profesor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un profesor por ID
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /profesores/${id}`);
    Profesores.findAll().then((resultado) => {
      const profesor = resultado.find((p) => p.id === id);
      if (profesor) {
        profesor
          .destroy()
          .then(() => res.json({ mensaje: "Profesor eliminado" }));
      } else {
        res.status(404).json({ error: "Profesor no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al eliminar profesor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;

// Registrar profesor
router.post("/registerProfesor/auth", (req, res) => {
  try {
    const { nombre, apellidos, dni, email, contrasena, numeroCuentaBancaria, pais, localidad } = req.body;
    console.log(`POST /profesores/registerProfesor/auth - Email: ${email}`);

    if (!nombre || !apellidos || !dni || !email || !contrasena || !numeroCuentaBancaria || !pais || !localidad) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    Profesores.findAll().then((profesores) => {
      const usuarioExistente = profesores.find((a) => a.email === email);
      if (usuarioExistente) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }

      Usuarios.create({ tipo: "profesor" }).then((nuevoUsuario) => {
        Profesores.create({
          usuarioId: nuevoUsuario.id,
          nombre: nombre,
          apellidos: apellidos,
          dni: dni,
          email: email,
          contrasena: contrasena,
          numCuentaBancaria: numeroCuentaBancaria,
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
