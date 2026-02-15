const express = require("express");
const router = express.Router();
const Profesores = require("../models/Profesores.js");
const Usuarios = require("../models/Usuarios.js");

// GET / - Listar
router.get("/", async (req, res) => {
  try {
    const data = await Profesores.findAll();
    res.json({ "Numero de profesores": data.length, Profesores: data });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /especializaciones - Obtener valores del ENUM para el frontend
// Útil para poblar selects en formularios sin harcodear valores en el cliente
router.get("/especializaciones", (req, res) => {
  try {
    const vals = Profesores.rawAttributes?.especializacion?.values || [];
    res.json({ especializaciones: vals });
  } catch (e) {
    res.status(500).json({ especializaciones: [] });
  }
});

// GET /:id - Detalle
router.get("/:id", async (req, res) => {
  try {
    const p = await Profesores.findByPk(req.params.id);
    p ? res.json(p) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /:id - Actualizar
router.put("/:id", async (req, res) => {
  try {
    const p = await Profesores.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: "No encontrado" });

    await p.update(req.body);
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /:id - Eliminar
router.delete("/:id", async (req, res) => {
  try {
    const p = await Profesores.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: "No encontrado" });

    await p.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /registerProfesor/auth - Registro completo
router.post("/registerProfesor/auth", async (req, res) => {
  let nuevoUsuario = null;
  try {
    const {
      nombre,
      apellidos,
      dni,
      email,
      contrasena,
      numeroCuentaBancaria,
      pais,
      localidad,
    } = req.body;

    if (
      !nombre ||
      !apellidos ||
      !dni ||
      !email ||
      !contrasena ||
      !numeroCuentaBancaria ||
      !pais ||
      !localidad
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Verificar email único en Profesores (debería ser en Usuarios idealmente, pero mantenemos lógica actual)
    const existe = await Profesores.findOne({ where: { email } });
    if (existe) return res.status(400).json({ error: "Email ya registrado" });

    // 1. Crear Usuario
    nuevoUsuario = await Usuarios.create({ tipo: "profesor" });

    // 2. Crear Profesor linkeado
    // Se crea el registro del profesor asociado a la cuenta de usuario recién creada.
    // Esto separa los datos de autenticación (Usuario) de los datos del perfil profesional (Profesor).
    const nuevoProfesor = await Profesores.create({
      usuarioId: nuevoUsuario.id,
      nombre,
      apellidos,
      dni,
      email,
      contrasena,
      numCuentaBancaria: numeroCuentaBancaria,
      pais,
      localidad,
    });

    res.status(201).json({
      mensaje: "Registro exitoso",
      usuario: {
        id: nuevoProfesor.id,
        nombre: nuevoProfesor.nombre,
        email: nuevoProfesor.email,
      },
    });
  } catch (e) {
    console.error("Error registro profesor:", e);
    // Rollback usuario si se creó
    if (nuevoUsuario) await nuevoUsuario.destroy().catch(() => {});
    res.status(500).json({ error: "Error en registro" });
  }
});

module.exports = router;
