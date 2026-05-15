// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();

// Importamos los modelos que necesitamos para buscar las credenciales
const Administradores = require("../models/Administradores.js");
const Alumnos = require("../models/Alumnos.js");
const Profesores = require("../models/Profesores.js");

// POST /login/auth — Recibe email y contraseña y comprueba si el usuario es administrador, alumno o profesor
router.post("/auth", async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    console.log(`POST /login/auth - Email: ${email}`);

    // Ambos campos son obligatorios para continuar
    if (!email || !contrasena) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son requeridos" });
    }

    // Buscamos primero entre los administradores; si coincide email y contraseña, respondemos con sus datos
    const admins = await Administradores.findAll();
    // Rechazamos administradores sin datos (nombre/apellidos) para evitar cuentas "vacías".
    const admin = admins.find(
      (a) =>
        a.email === email &&
        a.contrasena === contrasena &&
        a.nombre &&
        a.apellidos &&
        a.nombre.toString().trim() !== "" &&
        a.apellidos.toString().trim() !== "",
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

    // Si no era administrador, buscamos entre los alumnos con el mismo criterio.
    // Los alumnos vinculados a un profesor (esVinculado=1) nunca pueden iniciar sesión directamente.
    const alumnos = await Alumnos.findAll();
    // Rechazamos alumnos incompletos (sin nombre/apellidos) y los vinculados
    const alumno = alumnos.find(
      (a) =>
        !a.esVinculado &&
        a.email === email &&
        a.contrasena === contrasena &&
        a.nombre &&
        a.apellidos &&
        a.nombre.toString().trim() !== "" &&
        a.apellidos.toString().trim() !== "",
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
          esVinculado: alumno.esVinculado,
          profesorVinculadoId: alumno.profesorVinculadoId,
        },
      });
    }

    // Si no era alumno, buscamos entre los profesores con el mismo criterio
    const profesores = await Profesores.findAll();
    // Rechazamos profesores sin nombre/apellidos para evitar accesos antes de completar perfil
    const profesor = profesores.find(
      (p) =>
        p.email === email &&
        p.contrasena === contrasena &&
        p.nombre &&
        p.apellidos &&
        p.nombre.toString().trim() !== "" &&
        p.apellidos.toString().trim() !== "",
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
          alumnoVinculadoId: profesor.alumnoVinculadoId,
        },
      });
    }

    // Si no coincide con ningún registro, devolvemos error de credenciales incorrectas
    return res.status(401).json({ error: "Email o contraseña incorrectos" });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
