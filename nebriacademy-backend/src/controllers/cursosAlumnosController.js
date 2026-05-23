// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const CursosAlumnos = require("../models/CursosAlumnos.js");
const Cursos = require("../models/Cursos.js");

// ── CONTROLADOR: cursosAlumnos ───────────────────────────────────────────────
// Relación alumno-curso: inscripciones, favoritos, valoraciones y comentarios

// Listar todas las relaciones curso-alumno
exports.listAll = async (req, res) => {
  try {
    const data = await CursosAlumnos.findAll();
    res.json({ "Numero de cursosAlumnos": data.length, CursosAlumnos: data });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Obtener registro de un alumno en un curso
exports.registro = async (req, res) => {
  try {
    const { cursoId, alumnoId } = req.query;
    const registro = await CursosAlumnos.findOne({ where: { cursoId, alumnoId } });
    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Obtener relación curso-alumno por id
exports.getById = async (req, res) => {
  try {
    const r = await CursosAlumnos.findByPk(req.params.id);
    r ? res.json(r) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Votar/valorar un curso desde el registro de un alumno
exports.vote = async (req, res) => {
  try {
    const { cursoId, alumnoId, vote } = req.body;
    if (!cursoId || !alumnoId || typeof vote !== "boolean") {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    // Buscamos o creamos el registro alumno-curso para guardar su valoración
    const [registro] = await CursosAlumnos.findOrCreate({
      where: { cursoId, alumnoId },
      defaults: { favorito: false, apuntado: false, valoracion: null, comentario: null },
    });

    const actual = registro.valoracion;
    const intVote = vote ? 1 : -1;
    let cambio = 0;
    let nuevoEstado = vote;

    if (actual === vote) {
      // Si el alumno vuelve a votar lo mismo, anulamos su voto (toggle)
      nuevoEstado = null;
      cambio = -intVote;
    } else if (actual === null || actual === undefined) {
      // Primer voto del alumno: aplicamos el incremento directo
      cambio = intVote;
    } else {
      // El alumno cambia de voto (de like a dislike o viceversa): doble cambio
      cambio = intVote * 2;
    }

    const curso = await Cursos.findByPk(cursoId);
    if (!curso) return res.status(404).json({ error: "Curso no encontrado" });

    // Actualizamos la valoración global del curso y el estado del registro alumno
    await curso.increment("valoracion", { by: cambio });
    await registro.update({ valoracion: nuevoEstado });

    res.json({ registro: { ...registro.toJSON(), valoracion: nuevoEstado }, curso: { id: curso.id, valoracion: (curso.valoracion || 0) + cambio } });
  } catch (error) {
    console.error("Error voto curso:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Marcar/desmarcar curso como favorito para un alumno
exports.toggleFav = async (req, res) => {
  try {
    const { cursoId, alumnoId } = req.body;
    if (!cursoId || !alumnoId) return res.status(400).json({ error: "Faltan datos" });

    // Si el registro no existe lo creamos con favorito=true; si ya existe, invertimos el valor
    const [registro, created] = await CursosAlumnos.findOrCreate({ where: { cursoId, alumnoId }, defaults: { favorito: true } });
    if (!created) await registro.update({ favorito: !registro.favorito });
    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Marcar/desmarcar al alumno como apuntado en el curso
exports.toggleApuntado = async (req, res) => {
  try {
    const { cursoId, alumnoId } = req.body;
    if (!cursoId || !alumnoId) return res.status(400).json({ error: "Faltan datos" });

    // Si el registro no existe lo creamos con apuntado=true; si ya existe, invertimos el valor
    const [registro, created] = await CursosAlumnos.findOrCreate({ where: { cursoId, alumnoId }, defaults: { apuntado: true } });
    if (!created) await registro.update({ apuntado: !registro.apuntado });
    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Añadir/editar comentario del alumno sobre el curso
exports.comment = async (req, res) => {
  try {
    const { cursoId, alumnoId, comentario } = req.body;
    if (!cursoId || !alumnoId) return res.status(400).json({ error: "Faltan datos" });

    // Creamos el registro si no existe; si ya existe, actualizamos el comentario (máx. 500 caracteres)
    const [registro, created] = await CursosAlumnos.findOrCreate({ where: { cursoId, alumnoId }, defaults: { comentario: comentario || null } });
    if (!created) await registro.update({ comentario: comentario ? String(comentario).slice(0, 500) : null });
    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Actualizar registro curso-alumno por id
exports.update = async (req, res) => {
  try {
    const registro = await CursosAlumnos.findByPk(req.params.id);
    if (!registro) return res.status(404).json({ error: "No encontrado" });
    await registro.update(req.body);
    res.json(registro);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Eliminar registro curso-alumno
exports.remove = async (req, res) => {
  try {
    const r = await CursosAlumnos.destroy({ where: { id: req.params.id } });
    r ? res.json({ mensaje: "Eliminado" }) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};
