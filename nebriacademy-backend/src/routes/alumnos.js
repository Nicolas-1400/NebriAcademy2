const express = require("express");
const router = express.Router();
const Alumnos = require("../models/Alumnos.js");
const Usuarios = require("../models/Usuarios.js");

// Obtener todos los alumnos
router.get("/", (req, res) => {
  try {
    console.log("GET /alumnos");
    Alumnos.findAll().then((resultado) => {
      res.json({ "Numero de alumnos": resultado.length, Alumnos: resultado });
    });
  } catch (error) {
    console.error("Error al obtener alumnos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener por ID un alumno
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`GET /alumnos/${id}`);
    Alumnos.findAll().then((resultado) => {
      const alumno = resultado.find((a) => a.id === id);
      if (alumno) {
        res.json(alumno);
      } else {
        res.status(404).json({ error: "Alumno no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al obtener alumno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar un alumno por ID
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`PUT /alumnos/${id}`);
    Alumnos.findAll().then((resultado) => {
      const alumno = resultado.find((a) => a.id === id);
      if (alumno) {
        alumno.update(req.body).then((actualizado) => res.json(actualizado));
      } else {
        res.status(404).json({ error: "Alumno no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al actualizar alumno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un alumno por ID
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /alumnos/${id}`);
    Alumnos.findAll().then((resultado) => {
      const alumno = resultado.find((a) => a.id === id);
      if (alumno) {
        alumno.destroy().then(() => res.json({ mensaje: "Alumno eliminado" }));
      } else {
        res.status(404).json({ error: "Alumno no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al eliminar alumno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;

// Registrar Alumno Externo
router.post("/registerAlumnoExterno/auth", (req, res) => {
  try {
    const { nombre, apellidos, dni, email, contrasena, numeroTarjeta, pais, localidad } = req.body;
    console.log(`POST /alumnos/registerAlumnoExterno/auth - Email: ${email}`);

    if (!nombre || !apellidos || !dni || !email || !contrasena || !numeroTarjeta || !pais || !localidad) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    Alumnos.findAll().then((alumnos) => {
      const usuarioExistente = alumnos.find((a) => a.email === email);
      if (usuarioExistente) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }

      Usuarios.create({ tipo: "alumno" }).then((nuevoUsuario) => {
        Alumnos.create({
          usuarioId: nuevoUsuario.id,
          nombre: nombre,
          apellidos: apellidos,
          dni: dni,
          email: email,
          contrasena: contrasena,
          numeroTarjeta: numeroTarjeta,
          pais: pais,
          localidad: localidad
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

// Verificación Nebrija
router.post("/verificacionnebrija/auth", (req, res) => {
  try {
    const { email } = req.body;
    console.log(`POST /alumnos/verificacionnebrija/auth - Email: ${email}`);

    if (!email) {
      return res.status(400).json({ error: "El email es requerido" });
    }

    if (!email.endsWith("@alumnos.nebrija.es")) {
      return res.status(400).json({ error: "Ese correo no pertenece a la familia Nebrija" });
    }

    Alumnos.findAll().then((alumnos) => {
      const usuarioExistente = alumnos.find((a) => a.email === email);
      if (usuarioExistente) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }

      Usuarios.create({ tipo: "alumno" }).then((nuevoUsuario) => {
        Alumnos.create({ usuarioId: nuevoUsuario.id, email: email }).then((nuevoAlumno) => {
          res.status(201).json({
            mensaje: "Verificación exitosa",
            usuarioId: nuevoUsuario.id,
            alumnoId: nuevoAlumno.id,
            email: nuevoAlumno.email
          });
        }).catch((error) => {
          console.error("Error al crear alumno:", error);
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

// Completar registro Nebrija
router.post("/verificacionnebrija/completar", (req, res) => {
  try {
    const { alumnoId, nombre, apellidos, dni, contrasena, pais, localidad } = req.body;
    console.log(`POST /alumnos/verificacionnebrija/completar - AlumnoId: ${alumnoId}`);

    if (!alumnoId || !nombre || !apellidos || !dni || !contrasena || !pais || !localidad) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

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
