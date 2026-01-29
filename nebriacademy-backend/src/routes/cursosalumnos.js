const express = require("express");
const router = express.Router();
const CursosAlumnos = require("../models/CursosAlumnos.js");
const Cursos = require("../models/Cursos.js");

// Obtener todos los cursos-alumnos
router.get("/", (req, res) => {
  try {
    console.log("GET /cursosalumnos");
    CursosAlumnos.findAll().then((resultado) => {
      res.json({
        "Numero de cursosAlumnos": resultado.length,
        CursosAlumnos: resultado,
      });
    });
  } catch (error) {
    console.error("Error al obtener cursos-alumnos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener registro por cursoId y alumnoId vía query
router.get('/registro', async (req, res) => {
  try {
    const { cursoId, alumnoId } = req.query;
    const registro = await CursosAlumnos.findOne({ where: { cursoId: parseInt(cursoId), alumnoId: parseInt(alumnoId) } });
    res.json(registro);
  } catch (error) {
    console.error('Error en /cursosalumnos/registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener por ID un registro curso-alumno
router.get("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`GET /cursosalumnos/${id}`);
    CursosAlumnos.findAll().then((resultado) => {
      const registro = resultado.find((r) => r.id === id);
      if (registro) {
        res.json(registro);
      } else {
        res.status(404).json({ error: "Registro curso-alumno no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al obtener registro curso-alumno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crear un registro curso-alumno
router.post("/", (req, res) => {
  try {
    console.log("POST /cursosalumnos");
    CursosAlumnos.create(req.body).then((nuevo) => {
      res.status(201).json(nuevo);
    });
  } catch (error) {
    console.error("Error al crear registro curso-alumno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Votar (upvote/downvote). body: { cursoId, alumnoId, vote } where vote = true (up) o false (down)
router.post('/vote', async (req, res) => {
  try {
    const { cursoId, alumnoId, vote } = req.body;
    if (!cursoId || !alumnoId || typeof vote !== 'boolean') return res.status(400).json({ error: 'Parámetros invalidos' });

    // buscar o crear registro cursosAlumnos
    let registro = await CursosAlumnos.findOne({ where: { cursoId, alumnoId } });
    if (!registro) {
      registro = await CursosAlumnos.create({ cursoId, alumnoId, favorito: false, apuntado: false, valoracion: null, comentario: null });
    }

    const curso = await Cursos.findByPk(cursoId);
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });

    const actual = registro.valoracion === null || registro.valoracion === undefined ? null : registro.valoracion;
    const voteNum = vote ? 1 : -1;
    let votacion = 0;
    let nuevoValor = vote;

    if (actual === vote) {
      // deshacer voto
      nuevoValor = null;
      votacion = -voteNum;
    } else if (actual === null) {
      // nuevo voto
      votacion = voteNum;
    } else {
      // cambiar de up a down o viceversa
      votacion = voteNum * 2;
    }

    // actualizar curso.valoracion (numérico)
    const nuevaValoracionCurso = (curso.valoracion || 0) + votacion;
    await curso.update({ valoracion: nuevaValoracionCurso });

    // actualizar registro (booleano o null)
    await registro.update({ valoracion: nuevoValor });

    res.json({ registro, curso: { id: curso.id, valoracion: curso.valoracion } });
  } catch (error) {
    console.error('Error en /cursosalumnos/vote:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Toggle favorito. body: { cursoId, alumnoId }
router.post('/toggle-fav', async (req, res) => {
  try {
    const { cursoId, alumnoId } = req.body;
    if (!cursoId || !alumnoId) return res.status(400).json({ error: 'Parámetros invalidos' });
    let registro = await CursosAlumnos.findOne({ where: { cursoId, alumnoId } });
    if (!registro) registro = await CursosAlumnos.create({ cursoId, alumnoId, favorito: true });
    else await registro.update({ favorito: !registro.favorito });
    res.json(registro);
  } catch (error) {
    console.error('Error en /cursosalumnos/toggle-fav:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Toggle apuntado. body: { cursoId, alumnoId }
router.post('/toggle-apuntado', async (req, res) => {
  try {
    const { cursoId, alumnoId } = req.body;
    if (!cursoId || !alumnoId) return res.status(400).json({ error: 'Parámetros invalidos' });
    let registro = await CursosAlumnos.findOne({ where: { cursoId, alumnoId } });
    if (!registro) registro = await CursosAlumnos.create({ cursoId, alumnoId, apuntado: true });
    else await registro.update({ apuntado: !registro.apuntado });
    res.json(registro);
  } catch (error) {
    console.error('Error en /cursosalumnos/toggle-apuntado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Añadir/actualizar comentario (max 500). body: { cursoId, alumnoId, comentario }
router.post('/comment', async (req, res) => {
  try {
    const { cursoId, alumnoId, comentario } = req.body;
    if (!cursoId || !alumnoId) return res.status(400).json({ error: 'Parámetros invalidos' });
    const text = comentario ? String(comentario).slice(0, 500) : null;
    let registro = await CursosAlumnos.findOne({ where: { cursoId, alumnoId } });
    if (!registro) registro = await CursosAlumnos.create({ cursoId, alumnoId, comentario: text });
    else await registro.update({ comentario: text });
    res.json(registro);
  } catch (error) {
    console.error('Error en /cursosalumnos/comment:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar un registro curso-alumno por ID
router.put("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`PUT /cursosalumnos/${id}`);
    CursosAlumnos.findAll().then((resultado) => {
      const registro = resultado.find((r) => r.id === id);
      if (registro) {
        registro.update(req.body).then((actualizado) => res.json(actualizado));
      } else {
        res.status(404).json({ error: "Registro curso-alumno no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al actualizar registro curso-alumno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Eliminar un registro curso-alumno por ID
router.delete("/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log(`DELETE /cursosalumnos/${id}`);
    CursosAlumnos.findAll().then((resultado) => {
      const registro = resultado.find((r) => r.id === id);
      if (registro) {
        registro
          .destroy()
          .then(() => res.json({ mensaje: "Registro curso-alumno eliminado" }));
      } else {
        res.status(404).json({ error: "Registro curso-alumno no encontrado" });
      }
    });
  } catch (error) {
    console.error("Error al eliminar registro curso-alumno:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
