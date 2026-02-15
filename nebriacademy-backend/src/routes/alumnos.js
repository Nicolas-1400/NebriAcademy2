const express = require("express");
const router = express.Router();
const Alumnos = require("../models/Alumnos.js");
const Usuarios = require("../models/Usuarios.js");

// --- CRUD Básico ---

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

// --- Auth y Registro de Alumnos ---

/**
 * Registro completo de alumno externo.
 * Crea Usuario (tipo 'alumno') y ficha de Alumno con datos detallados.
 */
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

    // 1. Validación básica
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

    // 2. Verificar duplicidad
    const existente = await Alumnos.findOne({ where: { email } });
    if (existente)
      return res.status(400).json({ error: "Email ya registrado" });

    // 3. Crear Usuario + Alumno en transacción implícita (secuencial)
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
      // Rollback manual si falla la creación del perfil
      await nuevoUsuario.destroy();
      throw createError;
    }
  } catch (error) {
    console.error("Error registro externo:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

/**
 * Validar email @alumnos.nebrija.es para paso previo al registro.
 * No crea registros, solo confirma disponibilidad.
 */
router.post("/verificacionnebrija/auth", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requerido" });

    if (!email.endsWith("@alumnos.nebrija.es")) {
      return res
        .status(400)
        .json({ error: "Dominio no válido (debe ser Nebrija)" });
    }

    const existente = await Alumnos.findOne({ where: { email } });
    if (existente)
      return res.status(400).json({ error: "Email ya registrado" });

    res.json({ mensaje: "Email válido", email });
  } catch (error) {
    console.error("Error validación Nebrija:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

/**
 * Completar registro de alumno Nebrija tras validación.
 * Crea Usuario y Alumno (datos simplificados, sin tarjeta).
 */
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
        pais,
        localidad,
      });

      res.status(201).json({
        mensaje: "Registro Nebrija completado",
        usuario: { id: nuevoAlumno.id, email: nuevoAlumno.email },
      });
    } catch (createError) {
      await nuevoUsuario.destroy();
      throw createError;
    }
  } catch (error) {
    console.error("Error completar registro Nebrija:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

module.exports = router;
