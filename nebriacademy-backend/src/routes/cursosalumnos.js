const express = require("express");
const router = express.Router();
const CursosAlumnos = require("../models/CursosAlumnos.js");
const Cursos = require("../models/Cursos.js");

// ==========================================
// 1. Rutas de Obtención
// ==========================================
// Realiza el listado global de registros de la tabla N:M CursosAlumnos.
router.get("/", async (req, res) => {
  try {
    // Retorna array completo de instancias registradas
    const data = await CursosAlumnos.findAll();
    // Devuelve metadato del total junto al grupo de elementos
    res.json({ "Numero de cursosAlumnos": data.length, CursosAlumnos: data });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/registro", async (req, res) => {
  try {
    // Obtiene cursoId y alumnoId por parámetros de URL.
    const { cursoId, alumnoId } = req.query;
    // Retorna la coincidencia si ambas propiedades cumplen.
    const registro = await CursosAlumnos.findOne({
      where: { cursoId, alumnoId },
    });
    // Devuelve objeto respuesta.
    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const r = await CursosAlumnos.findByPk(req.params.id);
    r ? res.json(r) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 2. Rutas de Votación
// ==========================================
// Registra Boolean (Like/Dislike) en tabla secundaria e incrementa Integer base en Cursos.
router.post("/vote", async (req, res) => {
  try {
    const { cursoId, alumnoId, vote } = req.body;
    if (!cursoId || !alumnoId || typeof vote !== "boolean") {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    // Crea el objeto de no existir, por defecto reseteado en campos base si no habían interacciones.
    const [registro] = await CursosAlumnos.findOrCreate({
      where: { cursoId, alumnoId },
      defaults: {
        favorito: false,
        apuntado: false,
        valoracion: null,
        comentario: null,
      },
    });

    // Despliega evaluación lógica para ver si sumará, anulará o reducirá
    const actual = registro.valoracion;
    const intVote = vote ? 1 : -1;
    let delta = 0;
    let nuevoEstado = vote;

    if (actual === vote) {
      nuevoEstado = null;
      delta = -intVote;
    } else if (actual === null || actual === undefined) {
      delta = intVote;
    } else {
      delta = intVote * 2;
    }

    // Determina que curso debe ser alterado
    const curso = await Cursos.findByPk(cursoId);
    if (!curso) return res.status(404).json({ error: "Curso no encontrado" });

    // Modifica variable de Cursos iterando delta
    await curso.increment("valoracion", { by: delta });

    // Modifica variable de CursosAlumnos sobre el estado de la relación Boolean
    await registro.update({ valoracion: nuevoEstado });

    // Regresa el parseo numérico junto al nuevo objeto a la App.
    res.json({
      registro: { ...registro.toJSON(), valoracion: nuevoEstado },
      curso: { id: curso.id, valoracion: (curso.valoracion || 0) + delta },
    });
  } catch (error) {
    console.error("Error voto curso:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 3. Rutas de Favoritos
// ==========================================
// Actualiza Toggle para almacenar si el usuario lo guarda o lo elimina de favoritos.
router.post("/toggle-fav", async (req, res) => {
  try {
    const { cursoId, alumnoId } = req.body;
    if (!cursoId || !alumnoId)
      return res.status(400).json({ error: "Faltan datos" });

    const [registro] = await CursosAlumnos.findOrCreate({
      where: { cursoId, alumnoId },
      defaults: { favorito: true },
    });

    if (!registro.isNewRecord)
      await registro.update({ favorito: !registro.favorito });

    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 4. Rutas de Inscripción
// ==========================================
// Cambia la variable apuntado de la tabla N:M
router.post("/toggle-apuntado", async (req, res) => {
  try {
    const { cursoId, alumnoId } = req.body;
    if (!cursoId || !alumnoId)
      return res.status(400).json({ error: "Faltan datos" });

    const [registro] = await CursosAlumnos.findOrCreate({
      where: { cursoId, alumnoId },
      defaults: { apuntado: true },
    });

    if (!registro.isNewRecord)
      await registro.update({ apuntado: !registro.apuntado });

    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 5. Rutas de Comentarios
// ==========================================
// Usa o localiza la fila por findOrCreate y adjunta el String emitido.
router.post("/comment", async (req, res) => {
  try {
    const { cursoId, alumnoId, comentario } = req.body;
    if (!cursoId || !alumnoId)
      return res.status(400).json({ error: "Faltan datos" });

    const [registro] = await CursosAlumnos.findOrCreate({
      where: { cursoId, alumnoId },
      defaults: { comentario: comentario || null },
    });

    if (!registro.isNewRecord) {
      await registro.update({
        comentario: comentario ? String(comentario).slice(0, 500) : null,
      });
    }
    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 6. Rutas de Actualización
// ==========================================
// Actualiza cualquier fila identificando ID primary originaria.
router.put("/:id", async (req, res) => {
  try {
    const registro = await CursosAlumnos.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ error: "No encontrado" });

    await registro.update(req.body);
    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 7. Rutas de Eliminación
// ==========================================
// Borrado en cascada para fila en la base de datos de CursosAlumnos.
router.delete("/:id", async (req, res) => {
  try {
    const r = await CursosAlumnos.destroy({ where: { id: req.params.id } });
    r
      ? res.json({ mensaje: "Eliminado" })
      : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
