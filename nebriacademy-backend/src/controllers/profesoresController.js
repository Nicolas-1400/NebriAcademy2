// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const Profesores = require("../models/Profesores.js");
const Alumnos = require("../models/Alumnos.js");
const Usuarios = require("../models/Usuarios.js");

// ── CONTROLADOR: profesores ──────────────────────────────────────────────────
// Operaciones CRUD y utilidades relacionadas con profesores y su vinculación
// Listar todos los profesores
exports.listAll = async (req, res) => {
  try {
    const data = await Profesores.findAll();
    res.json({ "Numero de profesores": data.length, Profesores: data });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Obtener posibles especializaciones definidas en el modelo
exports.especializaciones = (req, res) => {
  try {
    const categ = Profesores.getAttributes().especializacion?.values || [];
    res.json({ especializaciones: categ });
  } catch (e) {
    res.status(500).json({ especializaciones: [] });
  }
};

// Obtener profesor por id
exports.getById = async (req, res) => {
  try {
    const p = await Profesores.findByPk(req.params.id);
    p ? res.json(p) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Actualizar profesor y sincronizar campos con el alumno vinculado si aplica
exports.update = async (req, res) => {
  try {
    const p = await Profesores.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: "No encontrado" });

    // Actualizamos el profesor y sincronizamos algunos campos con el alumno vinculado
    // si existe una relación 1:1 entre profesor <> alumno (campo alumnoVinculadoId).
    await p.update(req.body);

    if (p.alumnoVinculadoId) {
      // Lista de campos que consideramos seguros para replicar en el alumno vinculado
      const camposSincronizables = ["nombre","apellidos","dni","numTelefono","redes","pais","localidad"];
      const syncPayload = {};
      camposSincronizables.forEach((campo) => {
        if (req.body[campo] !== undefined) syncPayload[campo] = req.body[campo];
      });
      if (Object.keys(syncPayload).length > 0) {
        // Si hemos recibido datos, actualizamos también la entidad alumno vinculada
        const alumno = await Alumnos.findByPk(p.alumnoVinculadoId);
        if (alumno) await alumno.update(syncPayload);
      }
    }

    res.json(p);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Eliminar profesor (y alumno vinculado si existe), con notificaciones opcionales
exports.remove = async (req, res) => {
  try {
    const p = await Profesores.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: "No encontrado" });

    const { reason } = req.query;
    if (reason) {
      try {
        // Si se proporciona una razón, notificamos a los alumnos matriculados en los cursos
        const Cursos = require("../models/Cursos.js");
        const CursosAlumnos = require("../models/CursosAlumnos.js");
        const Notificaciones = require("../models/Notificaciones.js");
        const AlumnosModel = require("../models/Alumnos.js");

        const cursos = await Cursos.findAll({ where: { profesor: req.params.id } });
        for (const curso of cursos) {
          const matriculados = await CursosAlumnos.findAll({ where: { cursoId: curso.id, apuntado: true } });
          for (const m of matriculados) {
            const al = await AlumnosModel.findByPk(m.alumnoId);
            if (al && al.usuarioId) {
              // Creamos la notificación para cada alumno afectado
              await Notificaciones.create({ usuarioId: al.usuarioId, tipoUsuario: "alumno", mensaje: `El profesor ${p.nombre} ${p.apellidos} y sus cursos ("${curso.nombreCurso}") ya no están disponibles. Razón: ${reason}`, fecha: new Date() });
            }
          }
        }
      } catch (errNotif) {
        console.warn("Error enviando notificaciones de borrado de profesor:", errNotif.message);
      }
    }

    const usuarioIdProfesor = p.usuarioId;
    const alumnoVinculadoId = p.alumnoVinculadoId;

    if (alumnoVinculadoId) {
      // Si existe un alumno vinculado, eliminamos su entidad y su usuario asociado
      const alumnoVinculado = await Alumnos.findByPk(alumnoVinculadoId);
      if (alumnoVinculado) {
        const usuarioIdAlumno = alumnoVinculado.usuarioId;
        await alumnoVinculado.destroy();
        if (usuarioIdAlumno) await Usuarios.destroy({ where: { id: usuarioIdAlumno } });
      }
    }

    await p.destroy();
    if (usuarioIdProfesor) await Usuarios.destroy({ where: { id: usuarioIdProfesor } });

    res.json({ mensaje: "Profesor y alumno vinculado eliminados con éxito" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

// Crear profesor por admin y crear alumno vinculado automáticamente
exports.adminCrear = async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    if (!email || !contrasena) return res.status(400).json({ error: "Se requiere email y contraseña" });

    const existente = await Profesores.findOne({ where: { email } });
    if (existente) return res.status(400).json({ error: "Email ya registrado" });

    const nuevoUsuarioProfesor = await Usuarios.create({ tipo: "profesor" });

    let nuevoProfesor = null;
    let nuevoAlumno = null;
    let nuevoUsuarioAlumno = null;

    try {
      nuevoProfesor = await Profesores.create({ usuarioId: nuevoUsuarioProfesor.id, email, contrasena });
      nuevoUsuarioAlumno = await Usuarios.create({ tipo: "alumno" });
      nuevoAlumno = await Alumnos.create({ usuarioId: nuevoUsuarioAlumno.id, numeroTarjeta: null, esVinculado: 1, profesorVinculadoId: nuevoProfesor.id });
      await nuevoProfesor.update({ alumnoVinculadoId: nuevoAlumno.id });

      res.status(201).json({ mensaje: "Profesor creado con alumno vinculado", usuario: nuevoProfesor, alumnoVinculado: nuevoAlumno });
    } catch (createError) {
      if (nuevoAlumno) await nuevoAlumno.destroy().catch(() => {});
      if (nuevoUsuarioAlumno) await nuevoUsuarioAlumno.destroy().catch(() => {});
      if (nuevoProfesor) await nuevoProfesor.destroy().catch(() => {});
      await nuevoUsuarioProfesor.destroy().catch(() => {});
      throw createError;
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

// Verificación previa al completar registro de profesor
exports.verificacionAuth = async (req, res) => {
  const { email, contrasena } = req.body;
  try {
    const profesor = await Profesores.findOne({ where: { email } });
    if (!profesor) return res.status(404).json({ error: "Email no encontrado" });
    if (profesor.nombre || profesor.apellidos) return res.status(400).json({ error: "Esta cuenta ya ha sido registrada" });
    if (profesor.contrasena !== contrasena) return res.status(401).json({ error: "Código de verificación incorrecto" });
    res.json({ message: "Verificación exitosa" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// Completar registro de profesor con datos personales y sincronizar alumno vinculado
exports.verificacionCompletar = async (req, res) => {
  try {
    const { nombre, apellidos, dni, contrasena, email, numeroCuentaBancaria, pais, localidad, especializacion } = req.body;
    if (!nombre || !apellidos || !dni || !contrasena || !email || !numeroCuentaBancaria || !pais || !localidad || !especializacion) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const profesor = await Profesores.findOne({ where: { email } });
    if (!profesor) return res.status(404).json({ error: "Cuenta no encontrada" });
    if (profesor.nombre || profesor.apellidos) return res.status(400).json({ error: "Cuenta ya registrada" });

    await profesor.update({ nombre, apellidos, dni, contrasena, numCuentaBancaria: numeroCuentaBancaria, pais, localidad, especializacion });

    if (profesor.alumnoVinculadoId) {
      const alumnoVinculado = await Alumnos.findByPk(profesor.alumnoVinculadoId);
      if (alumnoVinculado) await alumnoVinculado.update({ nombre, apellidos, dni, pais, localidad });
    }

    res.status(200).json({ mensaje: "Registro Profesor completado exitosamente", usuario: { id: profesor.id, nombre: profesor.nombre, email: profesor.email } });
  } catch (e) {
    console.error("Error registro profesor:", e);
    res.status(500).json({ error: "Error en registro" });
  }
};

// Cambiar vista de cuenta entre profesor y alumno vinculados
exports.cambiarCuenta = async (req, res) => {
  try {
    const { profesorId, alumnoId } = req.body;
    if (profesorId) {
      const profesor = await Profesores.findByPk(profesorId);
      if (!profesor) return res.status(404).json({ error: "Profesor no encontrado" });
      if (!profesor.alumnoVinculadoId) return res.status(400).json({ error: "Este profesor no tiene alumno vinculado" });
      const alumno = await Alumnos.findByPk(profesor.alumnoVinculadoId);
      if (!alumno) return res.status(404).json({ error: "Alumno vinculado no encontrado" });
      return res.json({ mensaje: "Cambiado a modo alumno", tipo: "alumno", usuario: { id: alumno.id, usuarioId: alumno.usuarioId, dni: alumno.dni, nombre: alumno.nombre, apellidos: alumno.apellidos, email: alumno.email, numeroTarjeta: alumno.numeroTarjeta, numTelefono: alumno.numTelefono, redes: alumno.redes, pais: alumno.pais, localidad: alumno.localidad, esVinculado: alumno.esVinculado, profesorVinculadoId: alumno.profesorVinculadoId } });
    }

    if (alumnoId) {
      const alumno = await Alumnos.findByPk(alumnoId);
      if (!alumno) return res.status(404).json({ error: "Alumno no encontrado" });
      if (!alumno.esVinculado || !alumno.profesorVinculadoId) return res.status(400).json({ error: "Este alumno no está vinculado a un profesor" });
      const profesor = await Profesores.findByPk(alumno.profesorVinculadoId);
      if (!profesor) return res.status(404).json({ error: "Profesor vinculado no encontrado" });
      return res.json({ mensaje: "Cambiado a modo profesor", tipo: "profesor", usuario: { id: profesor.id, usuarioId: profesor.usuarioId, dni: profesor.dni, nombre: profesor.nombre, apellidos: profesor.apellidos, email: profesor.email, numCuentaBancaria: profesor.numCuentaBancaria, numTelefono: profesor.numTelefono, redes: profesor.redes, pais: profesor.pais, localidad: profesor.localidad, especializacion: profesor.especializacion, imagenPerfil: profesor.imagenPerfil, alumnoVinculadoId: profesor.alumnoVinculadoId } });
    }

    return res.status(400).json({ error: "Se requiere profesorId o alumnoId" });
  } catch (e) {
    console.error("Error cambiar-cuenta:", e);
    res.status(500).json({ error: "Server error" });
  }
};
