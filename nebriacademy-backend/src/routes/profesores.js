const express = require("express");
const router = express.Router();
const Profesores = require("../models/Profesores.js");
const Usuarios = require("../models/Usuarios.js");

// Rutas de Obtención
router.get("/", async (req, res) => {
  try {
    const data = await Profesores.findAll();
    res.json({ "Numero de profesores": data.length, Profesores: data });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/especializaciones", (req, res) => {
  try {
    const categ = Profesores.rawAttributes?.especializacion?.values || [];
    res.json({ especializaciones: categ });
  } catch (e) {
    res.status(500).json({ especializaciones: [] });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const p = await Profesores.findByPk(req.params.id);
    p ? res.json(p) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// Rutas de Actualización
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

// Rutas de Eliminación
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

// Rutas de Registro y Autenticación
router.post("/verificacionprofesor/auth", async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const profesor = await Profesores.findOne({ where: { email } });

    if (!profesor) {
      return res.status(404).json({ error: "Email no encontrado" });
    }

    if (profesor.nombre || profesor.apellidos) {
      return res
        .status(400)
        .json({ error: "Esta cuenta ya ha sido registrada" });
    }

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

    if (profesor.nombre || profesor.apellidos) {
      return res.status(400).json({ error: "Cuenta ya registrada" });
    }

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

module.exports = router;
