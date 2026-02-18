const express = require("express");
const router = express.Router();
const Alumnos = require("../models/Alumnos.js");
const Usuarios = require("../models/Usuarios.js");

// Rutas de Obtención
router.get("/", async (req, res) => {
  try {
    const todos = await Alumnos.findAll();
    res.json({ "Numero de alumnos": todos.length, Alumnos: todos });
  } catch (error) {
    console.error("Error listando alumnos:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const alumno = await Alumnos.findByPk(req.params.id);
    alumno
      ? res.json(alumno)
      : res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno" });
  }
});

// Rutas de Actualización
router.put("/:id", async (req, res) => {
  try {
    const alumno = await Alumnos.findByPk(req.params.id);
    if (!alumno) return res.status(404).json({ error: "No encontrado" });

    const actualizado = await alumno.update(req.body);
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando" });
  }
});

// Rutas de Eliminación
router.delete("/:id", async (req, res) => {
  try {
    const filas = await Alumnos.destroy({ where: { id: req.params.id } });
    filas
      ? res.json({ mensaje: "Eliminado" })
      : res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando" });
  }
});

// Rutas de Registro y Autenticación
router.post("/registerAlumnoExterno/auth", async (req, res) => {
  try {
    const {
      nombre,
      apellidos,
      dni,
      email,
      contrasena,
      numeroTarjeta,
      pais,
      localidad,
    } = req.body;

    if (
      !nombre ||
      !apellidos ||
      !dni ||
      !email ||
      !contrasena ||
      !numeroTarjeta ||
      !pais ||
      !localidad
    ) {
      return res.status(400).json({ error: "Todos los campos obligatorios" });
    }

    const existente = await Alumnos.findOne({ where: { email } });
    if (existente)
      return res.status(400).json({ error: "Email ya registrado" });

    const nuevoUsuario = await Usuarios.create({ tipo: "alumno" });

    try {
      const nuevoAlumno = await Alumnos.create({
        usuarioId: nuevoUsuario.id,
        nombre,
        apellidos,
        dni,
        email,
        contrasena,
        numeroTarjeta,
        pais,
        localidad,
      });

      res.status(201).json({
        mensaje: "Registro exitoso",
        usuario: { id: nuevoAlumno.id, nombre, email },
      });
    } catch (createError) {
      await nuevoUsuario.destroy();
      throw createError;
    }
  } catch (error) {
    console.error("Error registro externo:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.post("/verificacionnebrija/auth", async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const alumno = await Alumnos.findOne({ where: { email } });

    if (!alumno) {
      return res.status(404).json({ error: "Email no encontrado" });
    }

    if (alumno.nombre || alumno.apellidos) {
      return res
        .status(400)
        .json({ error: "Esta cuenta ya ha sido registrada" });
    }

    if (alumno.contrasena !== contrasena) {
      return res
        .status(401)
        .json({ error: "Código de verificación incorrecto" });
    }

    res.json({ message: "Verificación exitosa" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/verificacionnebrija/completar", async (req, res) => {
  try {
    const { nombre, apellidos, dni, contrasena, email, pais, localidad } =
      req.body;

    if (
      !nombre ||
      !apellidos ||
      !dni ||
      !contrasena ||
      !email ||
      !pais ||
      !localidad
    ) {
      return res.status(400).json({ error: "Campos incompletos" });
    }

    const alumno = await Alumnos.findOne({ where: { email } });

    if (!alumno) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    if (alumno.nombre || alumno.apellidos) {
      return res.status(400).json({ error: "Cuenta ya registrada" });
    }

    await alumno.update({
      nombre,
      apellidos,
      dni,
      contrasena,
      pais,
      localidad,
    });

    res.status(200).json({
      mensaje: "Registro Nebrija completado exitosamente",
      usuario: { id: alumno.id, email: alumno.email },
    });
  } catch (error) {
    console.error("Error completar registro Nebrija:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;
