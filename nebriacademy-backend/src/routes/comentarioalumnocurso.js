const express = require("express");
const router = express.Router();
const ComentarioAlumnoCurso = require("../models/ComentatioAlumnoCurso.js");
const Alumnos = require("../models/Alumnos.js");
const Profesores = require("../models/Profesores.js");

// ==========================================
// 1. Rutas de Obtención
// ==========================================
// Realiza el join de datos para devolver el listado de comentarios con nombre del autor.
router.get("/", async (req, res) => {
  try {
    // Recupera cursoId desde req.query.
    const { cursoId } = req.query;

    // Crea objeto de filtro para la claúsula where de Sequelize.
    const filtro = cursoId ? { where: { cursoId } } : {};
    const comentarios = await ComentarioAlumnoCurso.findAll(filtro);

    // Mapea el array resolviendo los perfiles mediante Promise.all
    const enhanced = await Promise.all(
      comentarios.map(async (c) => {
        let nombre = "Usuario",
          apellidos = "";

        // Busca el primer coincidente en la tabla Alumnos por usuarioId.
        let autor = await Alumnos.findOne({
          where: { usuarioId: c.usuarioId },
        });

        // Si no existe, realiza la búsqueda en la tabla Profesores.
        if (!autor) {
          autor = await Profesores.findOne({
            where: { usuarioId: c.usuarioId },
          });
        }

        // Asigna los valores extraídos del registro devuelto.
        if (autor) {
          nombre = autor.nombre;
          apellidos = autor.apellidos;
        }

        // Construye y devuelve el objeto completo con la estructura requerida.
        return {
          id: c.id,
          usuarioId: c.usuarioId,
          cursoId: c.cursoId,
          comentario: c.comentario,
          nombre,
          apellidos,
        };
      }),
    );

    res.json({
      "Numero de comentarios": enhanced.length,
      Comentarios: enhanced,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
    c ? res.json(c) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Error servidor" });
  }
});

// ==========================================
// 2. Rutas de Creación
// ==========================================
// Crea un comentario buscando el usuarioId según el rol provisto (alumno, profesor o administrador).
router.post("/", async (req, res) => {
  try {
    // Retorna error 400 si falta algún parámetro de creación.
    const { profileId, tipo, cursoId, comentario } = req.body;
    if (!profileId || !tipo || !cursoId || !comentario)
      return res.status(400).json({ error: "Faltan datos" });

    // Determina la tabla en función del parámetro tipo y trae la PK.
    let usuarioId = null;
    if (tipo === "alumno") {
      const u = await Alumnos.findByPk(profileId);
      if (u) usuarioId = u.usuarioId;
    } else if (tipo === "profesor") {
      const u = await Profesores.findByPk(profileId);
      if (u) usuarioId = u.usuarioId;
    } else if (tipo === "administrador") {
      const u = await require("../models/Administradores").findByPk(profileId);
      if (u) usuarioId = u.usuarioId;
    }

    if (!usuarioId)
      return res.status(404).json({ error: "Usuario no encontrado" });

    const nuevo = await ComentarioAlumnoCurso.create({
      usuarioId,
      cursoId,
      comentario,
    });
    res.status(201).json(nuevo);
  } catch (e) {
    console.error("Error creando comentario:", e);
    res.status(500).json({ error: "Error servidor" });
  }
});

// ==========================================
// 3. Rutas de Actualización
// ==========================================
// Valida que el ID pertenezca al mismo autor y actualiza el campo texto.
router.put("/:id", async (req, res) => {
  try {
    // Busca registro para comprobar si existe.
    const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "No encontrado" });

    // Desestructura para buscar usuario original.
    const { profileId, tipo, comentario } = req.body;

    let requesterUsuarioId = null;
    if (tipo === "alumno") {
      const u = await Alumnos.findByPk(profileId);
      if (u) requesterUsuarioId = u.usuarioId;
    } else if (tipo === "profesor") {
      const u = await Profesores.findByPk(profileId);
      if (u) requesterUsuarioId = u.usuarioId;
    }

    // Comprueba el usuarioId para prever fallo de seguridad sobre el endpoint.
    if (!requesterUsuarioId || requesterUsuarioId !== c.usuarioId) {
      return res.status(403).json({ error: "No autorizado" });
    }

    // Pasa el registro modificado a la base de datos por el método update.
    const actualizado = await c.update({
      comentario: comentario || c.comentario,
    });
    res.json(actualizado);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error servidor" });
  }
});

// ==========================================
// 4. Rutas de Eliminación
// ==========================================
// Compara las credenciales (autor) antes de ejecutar la directiva destroy.
router.delete("/:id", async (req, res) => {
  try {
    const c = await ComentarioAlumnoCurso.findByPk(req.params.id);
    if (!c) return res.status(404).json({ error: "No encontrado" });

    const { profileId, tipo } = req.query;

    let requesterUsuarioId = null;
    if (tipo === "alumno") {
      const u = await Alumnos.findByPk(profileId);
      if (u) requesterUsuarioId = u.usuarioId;
    } else if (tipo === "profesor") {
      const u = await Profesores.findByPk(profileId);
      if (u) requesterUsuarioId = u.usuarioId;
    }

    // Controla credencial autor.
    if (!requesterUsuarioId || requesterUsuarioId !== c.usuarioId) {
      return res.status(403).json({ error: "No autorizado" });
    }

    // Destruye tabla y responde JSON.
    await c.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error servidor" });
  }
});

module.exports = router;
