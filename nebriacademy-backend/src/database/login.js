// ==========================================
// 1. IMPORTACIONES
// ==========================================
const express = require("express");
const router = express.Router();

// Importación directa de Modelos Sequelize necesarios para contrastar las credenciales
const Administradores = require("../models/Administradores.js");
const Alumnos = require("../models/Alumnos.js");
const Profesores = require("../models/Profesores.js");

// ==========================================
// 2. ENDPOINTS Y RUTAS
// ==========================================

// Endpoint: POST /login/auth
// Propósito: Autenticación unificada de usuarios.
// Lógica: Busca secuencialmente en las tres tablas (Administradores, Alumnos, Profesores)
// devolviendo un token simulado o la estructura del usuario si hay coincidencias.
router.post("/auth", async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    console.log(`POST /login/auth - Email: ${email}`);
    if (!email || !contrasena) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son requeridos" });
    }
    const admins = await Administradores.findAll();
    const admin = admins.find(
      (a) => a.email === email && a.contrasena === contrasena,
    );
    if (admin) {
      return res.json({
        mensaje: "Login exitoso",
        tipo: "administrador",
        usuario: {
          id: admin.id,
          usuarioId: admin.usuarioId,
          dni: admin.dni,
          nombre: admin.nombre,
          apellidos: admin.apellidos,
          email: admin.email,
          numTelefono: admin.numTelefono,
          redes: admin.redes,
          pais: admin.pais,
          localidad: admin.localidad,
        },
      });
    }
    const alumnos = await Alumnos.findAll();
    const alumno = alumnos.find(
      (a) => a.email === email && a.contrasena === contrasena,
    );
    if (alumno) {
      return res.json({
        mensaje: "Login exitoso",
        tipo: "alumno",
        usuario: {
          id: alumno.id,
          usuarioId: alumno.usuarioId,
          dni: alumno.dni,
          nombre: alumno.nombre,
          apellidos: alumno.apellidos,
          email: alumno.email,
          numeroTarjeta: alumno.numeroTarjeta,
          numTelefono: alumno.numTelefono,
          redes: alumno.redes,
          pais: alumno.pais,
          localidad: alumno.localidad,
        },
      });
    }
    const profesores = await Profesores.findAll();
    const profesor = profesores.find(
      (p) => p.email === email && p.contrasena === contrasena,
    );
    if (profesor) {
      return res.json({
        mensaje: "Login exitoso",
        tipo: "profesor",
        usuario: {
          id: profesor.id,
          usuarioId: profesor.usuarioId,
          dni: profesor.dni,
          nombre: profesor.nombre,
          apellidos: profesor.apellidos,
          email: profesor.email,
          numCuentaBancaria: profesor.numCuentaBancaria,
          numTelefono: profesor.numTelefono,
          redes: profesor.redes,
          pais: profesor.pais,
          localidad: profesor.localidad,
          especializacion: profesor.especializacion,
          imagenPerfil: profesor.imagenPerfil,
        },
      });
    }

    return res.status(401).json({ error: "Email o contraseña incorrectos" });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
