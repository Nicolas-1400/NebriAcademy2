// ==========================================
// 1. IMPORTACIONES
// ==========================================
const express = require("express");
const router = express.Router();
const Alumnos = require("../models/Alumnos.js");
const Usuarios = require("../models/Usuarios.js");

// ==========================================
// 2. LECTURA DE DATOS (GET)
// ==========================================
// Obtiene la lista completa de registros mediante findAll.
router.get("/", async (req, res) => {
  try {
    // Llama a Alumnos.findAll().
    const todos = await Alumnos.findAll();
    // Devuelve los registros obtenidos y su cantidad en formato JSON.
    res.json({ "Numero de alumnos": todos.length, Alumnos: todos });
  } catch (error) {
    // Manejo de errores 500.
    console.error("Error listando alumnos:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

// Obtiene un registro puntual valiéndose de la clave primaria.
router.get("/:id", async (req, res) => {
  try {
    // Usa findByPk pasando req.params.id.
    const alumno = await Alumnos.findByPk(req.params.id);
    // Retorna el registro o error 404 si es nulo.
    alumno
      ? res.json(alumno)
      : res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    // Devuelve status 500 en fallo general.
    console.error(error);
    res.status(500).json({ error: "Error interno" });
  }
});

// ==========================================
// 3. ACTUALIZACIÓN (PUT)
// ==========================================
// Actualiza un registro basándose en un PK.
router.put("/:id", async (req, res) => {
  try {
    // Llama a findByPk.
    const alumno = await Alumnos.findByPk(req.params.id);
    if (!alumno) return res.status(404).json({ error: "No encontrado" });

    // Actualiza el registro pasándole req.body a alumno.update().
    const actualizado = await alumno.update(req.body);
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando" });
  }
});

// ==========================================
// 4. ELIMINACIÓN (DELETE)
// ==========================================
// Elimina un registro por ID.
router.delete("/:id", async (req, res) => {
  try {
    // Llama a destroy.
    const filas = await Alumnos.destroy({ where: { id: req.params.id } });
    // Devuelve confirmación o error 404 de no encontrar entidades afectadas.
    filas
      ? res.json({ mensaje: "Eliminado" })
      : res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    // Lanza 500 informando en consola de forma genérica.
    console.error(error);
    res.status(500).json({ error: "Error eliminando" });
  }
});

// ==========================================
// 5. FLUJOS DE ALTA EXTERNA Y NEBRIJA (AUTH / POST)
// ==========================================
// Crea un nuevo registro de alumno.
router.post("/registerAlumnoExterno/auth", async (req, res) => {
  try {
    // Obtiene las variables de req.body.
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

    // Valida que todos los campos requeridos estén presentes.
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

    // Comprueba existencia previa de email vía findOne.
    const existente = await Alumnos.findOne({ where: { email } });
    if (existente)
      return res.status(400).json({ error: "Email ya registrado" });

    // Instancia objeto base en id matriz Usuarios.
    const nuevoUsuario = await Usuarios.create({ tipo: "alumno" });

    try {
      // Create en tabla Alumnos para el objeto.
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

      // Retorna 201 y un JSON resumiendo datos.
      res.status(201).json({
        mensaje: "Registro exitoso",
        usuario: { id: nuevoAlumno.id, nombre, email },
      });
    } catch (createError) {
      // Ejecuta destroy como rollback si falla inserción acoplada.
      await nuevoUsuario.destroy();
      throw createError;
    }
  } catch (error) {
    console.error("Error registro externo:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Examina los casos de estudiantes pre-registrados comprobando password.
router.post("/verificacionnebrija/auth", async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    const alumno = await Alumnos.findOne({ where: { email } });

    if (!alumno) {
      return res.status(404).json({ error: "Email no encontrado" });
    }

    // Devuelve error 400 frenando el avance si el usuario ya posee un nombre.
    if (alumno.nombre || alumno.apellidos) {
      return res
        .status(400)
        .json({ error: "Esta cuenta ya ha sido registrada" });
    }

    // Verifica la equivalencia literal entre contraseñas.
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

// Ejecuta una petición PUT actualizando datos para el estudiante hallado por email.
router.post("/verificacionnebrija/completar", async (req, res) => {
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

    // Invoca findOne leyendo si un email existe.
    const alumno = await Alumnos.findOne({ where: { email } });

    if (!alumno) {
      return res.status(404).json({ error: "Cuenta no encontrada" });
    }

    // Evita repetición validando que nombre o apellidos permanezcan vacíos.
    if (alumno.nombre || alumno.apellidos) {
      return res.status(400).json({ error: "Cuenta ya registrada" });
    }

    // Anexa el perfil humano para materializar el estado del usuario como completo.
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

// ==========================================
// 6. EXPORTACIONES
// ==========================================
module.exports = router;
