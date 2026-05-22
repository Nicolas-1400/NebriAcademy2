const CursosAlumnos = require("../models/CursosAlumnos.js");
const Cursos = require("../models/Cursos.js");

module.exports = {
  listAll: async (req, res) => {
    try {
      const data = await CursosAlumnos.findAll();
      res.json({ "Numero de cursosAlumnos": data.length, CursosAlumnos: data });
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  },

  registro: async (req, res) => {
    try {
      const { cursoId, alumnoId } = req.query;
      const registro = await CursosAlumnos.findOne({ where: { cursoId, alumnoId } });
      res.json(registro);
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  },

  getById: async (req, res) => {
    try {
      const r = await CursosAlumnos.findByPk(req.params.id);
      r ? res.json(r) : res.status(404).json({ error: "No encontrado" });
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  },

  vote: async (req, res) => {
    try {
      const { cursoId, alumnoId, vote } = req.body;
      if (!cursoId || !alumnoId || typeof vote !== "boolean") {
        return res.status(400).json({ error: "Datos inválidos" });
      }

      const [registro] = await CursosAlumnos.findOrCreate({
        where: { cursoId, alumnoId },
        defaults: { favorito: false, apuntado: false, valoracion: null, comentario: null },
      });

      const actual = registro.valoracion;
      const intVote = vote ? 1 : -1;
      let cambio = 0;
      let nuevoEstado = vote;

      if (actual === vote) {
        nuevoEstado = null;
        cambio = -intVote;
      } else if (actual === null || actual === undefined) {
        cambio = intVote;
      } else {
        cambio = intVote * 2;
      }

      const curso = await Cursos.findByPk(cursoId);
      if (!curso) return res.status(404).json({ error: "Curso no encontrado" });

      await curso.increment("valoracion", { by: cambio });
      await registro.update({ valoracion: nuevoEstado });

      res.json({ registro: { ...registro.toJSON(), valoracion: nuevoEstado }, curso: { id: curso.id, valoracion: (curso.valoracion || 0) + cambio } });
    } catch (error) {
      console.error("Error voto curso:", error);
      res.status(500).json({ error: "Server error" });
    }
  },

  toggleFav: async (req, res) => {
    try {
      const { cursoId, alumnoId } = req.body;
      if (!cursoId || !alumnoId) return res.status(400).json({ error: "Faltan datos" });

      const [registro, created] = await CursosAlumnos.findOrCreate({ where: { cursoId, alumnoId }, defaults: { favorito: true } });
      if (!created) await registro.update({ favorito: !registro.favorito });
      res.json(registro);
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  },

  toggleApuntado: async (req, res) => {
    try {
      const { cursoId, alumnoId } = req.body;
      if (!cursoId || !alumnoId) return res.status(400).json({ error: "Faltan datos" });

      const [registro, created] = await CursosAlumnos.findOrCreate({ where: { cursoId, alumnoId }, defaults: { apuntado: true } });
      if (!created) await registro.update({ apuntado: !registro.apuntado });
      res.json(registro);
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  },

  comment: async (req, res) => {
    try {
      const { cursoId, alumnoId, comentario } = req.body;
      if (!cursoId || !alumnoId) return res.status(400).json({ error: "Faltan datos" });

      const [registro, created] = await CursosAlumnos.findOrCreate({ where: { cursoId, alumnoId }, defaults: { comentario: comentario || null } });
      if (!created) await registro.update({ comentario: comentario ? String(comentario).slice(0, 500) : null });
      res.json(registro);
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  },

  update: async (req, res) => {
    try {
      const registro = await CursosAlumnos.findByPk(req.params.id);
      if (!registro) return res.status(404).json({ error: "No encontrado" });
      await registro.update(req.body);
      res.json(registro);
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  },

  remove: async (req, res) => {
    try {
      const r = await CursosAlumnos.destroy({ where: { id: req.params.id } });
      r ? res.json({ mensaje: "Eliminado" }) : res.status(404).json({ error: "No encontrado" });
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
  },
};
