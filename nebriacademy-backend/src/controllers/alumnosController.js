// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const Alumnos = require("../models/Alumnos.js");
const Usuarios = require("../models/Usuarios.js");

// ── CONTROLADOR: alumnos ─────────────────────────────────────────────────────
// Operaciones CRUD, registro externo/Nebrija y verificación de alumnos

// Listar todos los alumnos
exports.listAll = async (req, res) => {
  try {
    const todos = await Alumnos.findAll();
    res.json({ "Numero de alumnos": todos.length, Alumnos: todos });
  } catch (error) {
    console.error("Error listando alumnos:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

// Obtener alumno por su id
exports.getById = async (req, res) => {
  try {
    const alumno = await Alumnos.findByPk(req.params.id);
    alumno
      ? res.json(alumno)
      : res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno" });
  }
};

// Actualizar un alumno existente
exports.update = async (req, res) => {
  try {
    const alumno = await Alumnos.findByPk(req.params.id);
    if (!alumno) return res.status(404).json({ error: "No encontrado" });

    const actualizado = await alumno.update(req.body);
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando" });
  }
};

// Eliminar alumno por id con notificaciones opcionales a profesores afectados
exports.remove = async (req, res) => {
  try {
    const alumno = await Alumnos.findByPk(req.params.id);
    if (!alumno) return res.status(404).json({ error: "No encontrado" });

    // No se permite borrar el alumno vinculado de un profesor de forma independiente
    if (alumno.esVinculado) {
      return res.status(400).json({
        error:
          "No se puede borrar la versión alumno de un profesor de forma independiente. Borra la cuenta del profesor para eliminar ambas.",
      });
    }

    const usuarioId = alumno.usuarioId;

    const { reason } = req.query;
    if (reason) {
      try {
        // Si se proporciona una razón, notificamos a los profesores de los cursos en los que estaba matriculado
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
              // Creamos la notificación para cada profesor afectado
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

    // Eliminamos también el usuario asociado si existe
    if (usuarioId) {
      await Usuarios.destroy({ where: { id: usuarioId } });
    }

    res.json({ mensaje: "Eliminado con éxito en cascada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando" });
  }
};

// Crear alumno por admin con solo email y contraseña (registro parcial)
exports.postAdminCrear = async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    if (!email || !contrasena)
      return res.status(400).json({ error: "Se requiere email y contraseña" });

    const existente = await Alumnos.findOne({ where: { email } });
    if (existente)
      return res.status(400).json({ error: "Email ya registrado" });

    const nuevoUsuario = await Usuarios.create({ tipo: "alumno" });

    try {
      // Creamos el alumno vinculado al nuevo usuario; si falla, revertimos el usuario
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
};

// Registro externo de alumno con todos los datos personales y de pago
exports.registerAlumnoExterno = async (req, res) => {
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
      // Creamos el alumno con todos los datos; si falla, revertimos el usuario
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
};

// Verificación previa al completar registro Nebrija (comprueba email y código)
exports.verificacionNeijrjaAuth = async (req, res) => {
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
};

// Completar registro Nebrija rellenando los datos personales del alumno preexistente
exports.verificacionNeijrjaCompletar = async (req, res) => {
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

    // Actualizamos el alumno con los datos personales del formulario de registro
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
};
