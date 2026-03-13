// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const Profesores = require("../models/Profesores.js");
const Usuarios = require("../models/Usuarios.js");

// ── GET ─────────────────────────────────────────────────────────────────────
// GET /profesores — Devuelve todos los profesores registrados
router.get("/", async (req, res) => {
  try {
    const data = await Profesores.findAll();
    res.json({ "Numero de profesores": data.length, Profesores: data });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /profesores/especializaciones — Devuelve los valores válidos del campo especializacion (los definidos en el ENUM)
router.get("/especializaciones", (req, res) => {
  try {
    const categ = Profesores.getAttributes().especializacion?.values || [];
    res.json({ especializaciones: categ });
  } catch (e) {
    res.status(500).json({ especializaciones: [] });
  }
});

// GET /profesores/:id — Devuelve un profesor concreto por su ID
router.get("/:id", async (req, res) => {
  try {
    const p = await Profesores.findByPk(req.params.id);
    p ? res.json(p) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── PUT ─────────────────────────────────────────────────────────────────────
// PUT /profesores/:id — Actualiza los datos del profesor con los campos que vengan en el body
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

// ── DELETE ──────────────────────────────────────────────────────────────────
// DELETE /profesores/:id — Elimina el registro del profesor de la base de datos y su usuario base
router.delete("/:id", async (req, res) => {
  try {
    const p = await Profesores.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: "No encontrado" });

    const usuarioId = p.usuarioId;
    await p.destroy();
    
    // Eliminar base principal en Usuarios
    if (usuarioId) {
      await Usuarios.destroy({ where: { id: usuarioId } });
    }

    res.json({ mensaje: "Eliminado con éxito" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST ADMIN ──────────────────────────────────────────────────────────────
// POST /profesores/admin/crear — Crea un profesor base (incompleto) desde admin
router.post("/admin/crear", async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    if (!email || !contrasena) return res.status(400).json({ error: "Se requiere email y contraseña" });

    const existente = await Profesores.findOne({ where: { email } });
    if (existente) return res.status(400).json({ error: "Email ya registrado" });

    // 1. Crear el usuario base
    const nuevoUsuario = await Usuarios.create({ tipo: "profesor" });

    try {
      // 2. Crear profe con cuenta incompleta
      const nuevoProfesor = await Profesores.create({
        usuarioId: nuevoUsuario.id,
        email,
        contrasena,
      });
      res.status(201).json({ mensaje: "Profesor creado", usuario: nuevoProfesor });
    } catch (createError) {
      await nuevoUsuario.destroy();
      throw createError;
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── POST ────────────────────────────────────────────────────────────────────
// POST /profesores/verificacionprofesor/auth — Primera fase del registro para profesores.
// Comprueba que el email existe y que la contraseña temporal es correcta.
router.post("/verificacionprofesor/auth", async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    // Buscamos la cuenta del profesor por email
    const profesor = await Profesores.findOne({ where: { email } });

    if (!profesor) {
      return res.status(404).json({ error: "Email no encontrado" });
    }

    // Si ya tiene nombre y apellidos, la cuenta fue completada anteriormente
    if (profesor.nombre || profesor.apellidos) {
      return res
        .status(400)
        .json({ error: "Esta cuenta ya ha sido registrada" });
    }

    // Verificamos que la contraseña temporal coincide con la almacenada
    if (profesor.contrasena !== contrasena) {
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

// POST /profesores/verificacionprofesor/completar — Segunda fase: rellena los datos personales del profesor
router.post("/verificacionprofesor/completar", async (req, res) => {
  try {
    const {
      nombre,
      apellidos,
      dni,
      contrasena,
      email,
      numeroCuentaBancaria,
      pais,
      localidad,
      especializacion,
    } = req.body;

    // Comprobamos que todos los campos obligatorios están presentes
    if (
      !nombre ||
      !apellidos ||
      !dni ||
      !contrasena ||
      !email ||
      !numeroCuentaBancaria ||
      !pais ||
      !localidad ||
      !especializacion
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const profesor = await Profesores.findOne({ where: { email } });
    if (!profesor) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    // Si ya tiene datos personales, la cuenta ya fue completada anteriormente
    if (profesor.nombre || profesor.apellidos) {
      return res.status(400).json({ error: "Cuenta ya registrada" });
    }

    // Actualizamos el registro del profesor con los datos del formulario
    await profesor.update({
      nombre,
      apellidos,
      dni,
      contrasena,
      numCuentaBancaria: numeroCuentaBancaria,
      pais,
      localidad,
      especializacion,
    });

    res.status(200).json({
      mensaje: "Registro Profesor completado exitosamente",
      usuario: {
        id: profesor.id,
        nombre: profesor.nombre,
        email: profesor.email,
      },
    });
  } catch (e) {
    console.error("Error registro profesor:", e);
    res.status(500).json({ error: "Error en registro" });
  }
});

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
