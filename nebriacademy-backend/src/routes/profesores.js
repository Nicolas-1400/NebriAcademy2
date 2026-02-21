// ==========================================
// 1. IMPORTACIONES
// ==========================================
const express = require("express");
const router = express.Router();
const Profesores = require("../models/Profesores.js");
const Usuarios = require("../models/Usuarios.js");

// ==========================================
// 2. LECTURA DE DATOS (GET)
// ==========================================
// Devuelve lista total invocada por findAll.
router.get("/", async (req, res) => {
  try {
    const data = await Profesores.findAll();
    res.json({ "Numero de profesores": data.length, Profesores: data });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// Obtiene los valores predeterminados de un enum o arreglo del modelo.
router.get("/especializaciones", (req, res) => {
  try {
    const categ = Profesores.getAttributes().especializacion?.values || [];
    res.json({ especializaciones: categ });
  } catch (e) {
    res.status(500).json({ especializaciones: [] });
  }
});

// Consulta Primary Key.
router.get("/:id", async (req, res) => {
  try {
    const p = await Profesores.findByPk(req.params.id);
    p ? res.json(p) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 3. ACTUALIZACIÓN (PUT)
// ==========================================
// Modifica instancia identificada por URL param a través de un JSON enviado en cuerpo res.
router.put("/:id", async (req, res) => {
  try {
    // Busca objeto.
    const p = await Profesores.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: "No encontrado" });

    // Modifica usando body.
    await p.update(req.body);
    // Devuelve JSON actualizado.
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 4. ELIMINACIÓN (DELETE)
// ==========================================
// Identifica primary key y llama a la clase genérica destroy de sequelize.
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

// ==========================================
// 5. REGISTRO Y VERIFICACIÓN (POST)
// ==========================================
// Valida strings de autenticación iniciales contra base de datos.
router.post("/verificacionprofesor/auth", async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const profesor = await Profesores.findOne({ where: { email } });

    if (!profesor) {
      return res.status(404).json({ error: "Email no encontrado" });
    }

    // Impide usar la misma clave si la cuenta ya tiene un perfil anexado.
    if (profesor.nombre || profesor.apellidos) {
      return res
        .status(400)
        .json({ error: "Esta cuenta ya ha sido registrada" });
    }

    // Evalúa si la credencial ingresada existe coincidiendo nativamente.
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

// Reemplaza por el objeto enviado, dando el registro por completado.
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

    // Llama a update aplicando los ajustes pasados en el arreglo JSON.
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

// ==========================================
// 6. EXPORTACIONES
// ==========================================
module.exports = router;
