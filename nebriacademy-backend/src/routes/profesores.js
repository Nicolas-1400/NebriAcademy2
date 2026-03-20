// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const express = require("express");
const router = express.Router();
const Profesores = require("../models/Profesores.js");
const Alumnos = require("../models/Alumnos.js");
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
// PUT /profesores/:id — Actualiza los datos del profesor y sincroniza campos comunes al alumno vinculado
router.put("/:id", async (req, res) => {
  try {
    const p = await Profesores.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: "No encontrado" });

    await p.update(req.body);

    // Sincronizar campos comunes al alumno vinculado (excepto email, contrasena y tarjeta)
    if (p.alumnoVinculadoId) {
      const camposSincronizables = ["nombre", "apellidos", "dni", "numTelefono", "redes", "pais", "localidad"];
      const syncPayload = {};
      camposSincronizables.forEach((campo) => {
        if (req.body[campo] !== undefined) syncPayload[campo] = req.body[campo];
      });
      if (Object.keys(syncPayload).length > 0) {
        const alumno = await Alumnos.findByPk(p.alumnoVinculadoId);
        if (alumno) await alumno.update(syncPayload);
      }
    }

    res.json(p);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});


// ── DELETE ──────────────────────────────────────────────────────────────────
// DELETE /profesores/:id — Elimina el profesor, su usuario base y también el alumno vinculado (si lo tiene)
router.delete("/:id", async (req, res) => {
  try {
    const p = await Profesores.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: "No encontrado" });

    const usuarioIdProfesor = p.usuarioId;
    const alumnoVinculadoId = p.alumnoVinculadoId;

    // Eliminar el alumno vinculado y su usuario base primero (para evitar FK constraints)
    if (alumnoVinculadoId) {
      const alumnoVinculado = await Alumnos.findByPk(alumnoVinculadoId);
      if (alumnoVinculado) {
        const usuarioIdAlumno = alumnoVinculado.usuarioId;
        await alumnoVinculado.destroy();
        if (usuarioIdAlumno) {
          await Usuarios.destroy({ where: { id: usuarioIdAlumno } });
        }
      }
    }

    await p.destroy();

    if (usuarioIdProfesor) {
      await Usuarios.destroy({ where: { id: usuarioIdProfesor } });
    }

    res.json({ mensaje: "Profesor y alumno vinculado eliminados con éxito" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});


// ── POST ADMIN ──────────────────────────────────────────────────────────────
// POST /profesores/admin/crear — Crea un profesor base (incompleto) desde admin.
// También crea automáticamente una cuenta de alumno vinculada con los mismos datos.
router.post("/admin/crear", async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    if (!email || !contrasena)
      return res.status(400).json({ error: "Se requiere email y contraseña" });

    const existente = await Profesores.findOne({ where: { email } });
    if (existente)
      return res.status(400).json({ error: "Email ya registrado" });

    // 1. Crear el usuario base del profesor
    const nuevoUsuarioProfesor = await Usuarios.create({ tipo: "profesor" });

    let nuevoProfesor = null;
    let nuevoAlumno = null;
    let nuevoUsuarioAlumno = null;

    try {
      // 2. Crear el profesor con cuenta incompleta
      nuevoProfesor = await Profesores.create({
        usuarioId: nuevoUsuarioProfesor.id,
        email,
        contrasena,
      });

      // 3. Crear el usuario base del alumno vinculado
      nuevoUsuarioAlumno = await Usuarios.create({ tipo: "alumno" });

      // 4. Crear el alumno vinculado sin email ni contraseña (solo accesible vía cambio de cuenta)
      nuevoAlumno = await Alumnos.create({
        usuarioId: nuevoUsuarioAlumno.id,
        numeroTarjeta: null,
        esVinculado: 1,
        profesorVinculadoId: nuevoProfesor.id,
      });

      // 5. Actualizar el profesor con el ID del alumno vinculado
      await nuevoProfesor.update({ alumnoVinculadoId: nuevoAlumno.id });

      res.status(201).json({
        mensaje: "Profesor creado con alumno vinculado",
        usuario: nuevoProfesor,
        alumnoVinculado: nuevoAlumno,
      });
    } catch (createError) {
      // Rollback manual: eliminar todo lo creado si algo falla
      if (nuevoAlumno) await nuevoAlumno.destroy().catch(() => {});
      if (nuevoUsuarioAlumno)
        await nuevoUsuarioAlumno.destroy().catch(() => {});
      if (nuevoProfesor) await nuevoProfesor.destroy().catch(() => {});
      await nuevoUsuarioProfesor.destroy().catch(() => {});
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
// y los sincroniza también en el alumno vinculado.
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

    // Sincronizar datos comunes al alumno vinculado (sin email ni contraseña)
    if (profesor.alumnoVinculadoId) {
      const alumnoVinculado = await Alumnos.findByPk(profesor.alumnoVinculadoId);
      if (alumnoVinculado) {
        await alumnoVinculado.update({
          nombre,
          apellidos,
          dni,
          pais,
          localidad,
        });
      }
    }

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

// ── CAMBIAR CUENTA ──────────────────────────────────────────────────────────
// POST /profesores/cambiar-cuenta — Alterna la sesión entre la cuenta de profesor y la de alumno vinculado.
// Si viene profesorId: devuelve los datos de sesión del alumno vinculado (modo alumno).
// Si viene alumnoId (con esVinculado=1): devuelve los datos de sesión del profesor vinculado (modo profesor).
router.post("/cambiar-cuenta", async (req, res) => {
  try {
    const { profesorId, alumnoId } = req.body;

    if (profesorId) {
      // Cambio: profesor → alumno vinculado
      const profesor = await Profesores.findByPk(profesorId);
      if (!profesor) return res.status(404).json({ error: "Profesor no encontrado" });
      if (!profesor.alumnoVinculadoId)
        return res.status(400).json({ error: "Este profesor no tiene alumno vinculado" });

      const alumno = await Alumnos.findByPk(profesor.alumnoVinculadoId);
      if (!alumno) return res.status(404).json({ error: "Alumno vinculado no encontrado" });

      return res.json({
        mensaje: "Cambiado a modo alumno",
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

    if (alumnoId) {
      // Cambio: alumno vinculado → profesor
      const alumno = await Alumnos.findByPk(alumnoId);
      if (!alumno) return res.status(404).json({ error: "Alumno no encontrado" });
      if (!alumno.esVinculado || !alumno.profesorVinculadoId)
        return res.status(400).json({ error: "Este alumno no está vinculado a un profesor" });

      const profesor = await Profesores.findByPk(alumno.profesorVinculadoId);
      if (!profesor) return res.status(404).json({ error: "Profesor vinculado no encontrado" });

      return res.json({
        mensaje: "Cambiado a modo profesor",
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

    return res.status(400).json({ error: "Se requiere profesorId o alumnoId" });
  } catch (e) {
    console.error("Error cambiar-cuenta:", e);
    res.status(500).json({ error: "Server error" });
  }
});

// ── EXPORTAR ─────────────────────────────────────────────────────────────────
module.exports = router;
