// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const Alumnos = require("../models/Alumnos.js");
const Usuarios = require("../models/Usuarios.js");

// ── GET ─────────────────────────────────────────────────────────────────────
// GET /alumnos — Devuelve todos los alumnos registrados
router.get("/", async (req, res) => {
  try {
    const todos = await Alumnos.findAll();
    res.json({ "Numero de alumnos": todos.length, Alumnos: todos });
  } catch (error) {
    console.error("Error listando alumnos:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

// GET /alumnos/:id — Devuelve un alumno concreto buscándolo por su ID
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

// ── PUT ─────────────────────────────────────────────────────────────────────
// PUT /alumnos/:id — Actualiza los datos del alumno con los campos que vengan en el body
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

// ── DELETE ──────────────────────────────────────────────────────────────────
// DELETE /alumnos/:id — Elimina el registro del alumno de la base de datos (y su usuario asociado).
// Los alumnos vinculados a un profesor NO se pueden borrar de forma independiente.
router.delete("/:id", async (req, res) => {
  try {
    const alumno = await Alumnos.findByPk(req.params.id);
    if (!alumno) return res.status(404).json({ error: "No encontrado" });

    // Bloquear borrado de alumnos vinculados a un profesor
    if (alumno.esVinculado) {
      return res.status(400).json({
        error:
          "No se puede borrar la versión alumno de un profesor de forma independiente. Borra la cuenta del profesor para eliminar ambas.",
      });
    }

    const usuarioId = alumno.usuarioId;

    // Si se proporciona una razón, notificamos a los profesores afectados
    const { reason } = req.query;
    if (reason) {
      try {
        const Cursos = require("../models/Cursos.js");
        const CursosAlumnos = require("../models/CursosAlumnos.js");
        const Notificaciones = require("../models/Notificaciones.js");
        const ProfesoresModel = require("../models/Profesores.js");

        const matriculas = await CursosAlumnos.findAll({ 
          where: { alumnoId: req.params.id, apuntado: true } 
        });
        for (const m of matriculas) {
          const curso = await Cursos.findByPk(m.cursoId);
          if (curso && curso.profesor) {
            const prof = await ProfesoresModel.findByPk(curso.profesor);
            if (prof && prof.usuarioId) {
              await Notificaciones.create({
                usuarioId: prof.usuarioId,
                tipoUsuario: "profesor",
                mensaje: `El alumno ${alumno.nombre} ${alumno.apellidos} ha sido dado de baja. Razón: ${reason}`,
                fecha: new Date(),
              });
            }
          }
        }
      } catch (errNotif) {
        console.warn("Error enviando notificaciones de borrado de alumno:", errNotif.message);
      }
    }

    await alumno.destroy();

    if (usuarioId) {
      await Usuarios.destroy({ where: { id: usuarioId } });
    }

    res.json({ mensaje: "Eliminado con éxito en cascada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando" });
  }
});

// ── POST ADMIN ──────────────────────────────────────────────────────────────
// POST /alumnos/admin/crear — Crea un alumno solo con email y contraseña, ideal para cuenta incompleta (admin)
router.post("/admin/crear", async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    if (!email || !contrasena)
      return res.status(400).json({ error: "Se requiere email y contraseña" });

    const existente = await Alumnos.findOne({ where: { email } });
    if (existente)
      return res.status(400).json({ error: "Email ya registrado" });

    // 1. Crear usuario base
    const nuevoUsuario = await Usuarios.create({ tipo: "alumno" });

    try {
      // 2. Crear registro de alumno con campos en blanco menos email, contrasena y el id del usuario base
      const nuevoAlumno = await Alumnos.create({
        usuarioId: nuevoUsuario.id,
        email,
        contrasena,
      });
      res.status(201).json({ mensaje: "Alumno creado", usuario: nuevoAlumno });
    } catch (createError) {
      await nuevoUsuario.destroy();
      throw createError;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando alumno" });
  }
});

// ── POST ────────────────────────────────────────────────────────────────────
// POST /alumnos/registerAlumnoExterno/auth — Registra un alumno que no es de Nebrija
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

    // Todos estos campos son obligatorios; si falta alguno, se rechaza la petición
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

    // Comprobamos que el email no esté ya registrado antes de crear nada
    const existente = await Alumnos.findOne({ where: { email } });
    if (existente)
      return res.status(400).json({ error: "Email ya registrado" });

    // Creamos primero el registro base en la tabla "usuarios"
    const nuevoUsuario = await Usuarios.create({ tipo: "alumno" });

    try {
      // Creamos el alumno vinculado al usuario recién creado
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
      // Si falló la creación del alumno, borramos el usuario para no dejar datos residuales
      await nuevoUsuario.destroy();
      throw createError;
    }
  } catch (error) {
    console.error("Error registro externo:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// POST /alumnos/verificacionnebrija/auth — Primera fase del registro para alumnos de Nebrija.
// El alumno ya existe en la BDD con email y contraseña temporal; aquí se verifica que son correctos.
router.post("/verificacionnebrija/auth", async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    // Buscamos la cuenta por email
    const alumno = await Alumnos.findOne({ where: { email } });

    if (!alumno) {
      return res.status(404).json({ error: "Email no encontrado" });
    }

    // Si ya tiene nombre y apellidos, la cuenta fue completada antes; no se puede volver a verificar
    if (alumno.nombre || alumno.apellidos) {
      return res
        .status(400)
        .json({ error: "Esta cuenta ya ha sido registrada" });
    }

    // Verificamos que la contraseña temporal enviada coincide con la almacenada
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

// POST /alumnos/verificacionnebrija/completar — Segunda fase: rellena los datos personales del alumno Nebrija
router.post("/verificacionnebrija/completar", async (req, res) => {
  try {
    const { nombre, apellidos, dni, contrasena, email, pais, localidad } =
      req.body;

    // Comprobamos que todos los campos necesarios para completar el perfil estén presentes
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

    // Si ya tiene datos personales, la cuenta ya fue completada anteriormente
    if (alumno.nombre || alumno.apellidos) {
      return res.status(400).json({ error: "Cuenta ya registrada" });
    }

    // Actualizamos el registro del alumno con los datos del formulario
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

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
