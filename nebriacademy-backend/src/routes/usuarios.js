const express = require("express");
const router = express.Router();
const Usuarios = require("../models/Usuarios.js");


    const Administradores = require("../models/Administradores.js");
    const Alumnos = require("../models/Alumnos.js");
    const Profesores = require("../models/Profesores.js");

// Obtener todos los usuarios
router.get("/", (req, res) => {
  try {
    console.log("GET /usuarios");
    Usuarios.findAll().then((resultado) => {
      res.json({ "Numero de usuarios": resultado.length, Usuarios: resultado });
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener por ID un usuario
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`GET /usuarios/${id}`);
    Usuarios.findAll().then((resultado) => {
      const usuario = resultado.find((u) => u.id === id);
      if (usuario) {
        res.json(usuario);
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear un usuario
router.post("/", (req, res) => {
  try {
    console.log("POST /usuarios");
    Usuarios.create(req.body).then((nuevo) => {
      res.status(201).json(nuevo);
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar un usuario por ID
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`PUT /usuarios/${id}`);
    Usuarios.findAll().then((resultado) => {
      const usuario = resultado.find((u) => u.id === id);
      if (usuario) {
        usuario.update(req.body).then((actualizado) => res.json(actualizado));
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un usuario por ID
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /usuarios/${id}`);
    Usuarios.findAll().then((resultado) => {
      const usuario = resultado.find((u) => u.id === id);
      if (usuario) {
        usuario
          .destroy()
          .then(() => res.json({ mensaje: "Usuario eliminado" }));
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Login de usuario
router.post("/login/auth", (req, res) => {
  try {
    const { email, contrasena } = req.body;
    console.log(`POST /usuarios/login/auth - Email: ${email}`);

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
