const express = require('express');
const router = express.Router();
const ApuntesAlumnos = require('../models/ApuntesAlumnos.js');
const Apuntes = require('../models/Apuntes.js');

// Listar todos los registros
router.get('/', async (req, res) => {
  try {
    const all = await ApuntesAlumnos.findAll();
    res.json({ 'Numero de registros': all.length, ApuntesAlumnos: all });
  } catch (error) {
    console.error('Error en /apuntesalumnos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener registro por apunteId y alumnoId vía query
router.get('/registro', async (req, res) => {
  try {
    const { apunteId, alumnoId } = req.query;
    if (!apunteId || !alumnoId) return res.status(400).json({ error: 'Parametros invalidos' });
    const registro = await ApuntesAlumnos.findOne({ where: { apunteId: parseInt(apunteId), alumnoId: parseInt(alumnoId) } });
    res.json(registro || {});
  } catch (error) {
    console.error('Error en /apuntesalumnos/registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Votar (megusta/unmegusta). body: { apunteId, alumnoId, vote } where vote = true (megusta)
router.post('/vote', async (req, res) => {
  try {
    const { apunteId, alumnoId, vote } = req.body;
    if (!apunteId || !alumnoId || typeof vote !== 'boolean' || vote !== true) return res.status(400).json({ error: 'Parámetros invalidos: solo vote=true permitido' });

    let registro = await ApuntesAlumnos.findOne({ where: { apunteId, alumnoId } });
    if (!registro) {
      registro = await ApuntesAlumnos.create({ apunteId, alumnoId, megusta: null });
    }

    const actual = registro.megusta === true ? true : null;
    let votacion = 0;
    let nuevoValor = null;

    if (actual === true) {
      // quitar megusta
      nuevoValor = null;
      votacion = -1;
    } else {
      // poner megusta
      nuevoValor = true;
      votacion = 1;
    }

    // actualizar apunte.valoracion (numérico)
    const apunte = await Apuntes.findByPk(apunteId);
    if (!apunte) return res.status(404).json({ error: 'Apunte no encontrado' });
    const nuevaValoracion = (apunte.valoracion || 0) + votacion;
    await apunte.update({ valoracion: nuevaValoracion });

    // actualizar/guardar registro
    await registro.update({ megusta: nuevoValor });

    const respuestaRegistro = { apunteId: registro.apunteId, alumnoId: registro.alumnoId, valoracion: registro.megusta };
    res.json({ registro: respuestaRegistro, apunte: { id: apunte.id, valoracion: apunte.valoracion } });
  } catch (error) {
    console.error('Error en /apuntesalumnos/vote:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener ids de apuntes con megusta por alumno: /apuntesalumnos/likes?alumnoId=NN
router.get('/likes', async (req, res) => {
  try {
    const alumnoId = req.query.alumnoId ? parseInt(req.query.alumnoId) : null;
    if (!alumnoId) return res.status(400).json({ error: "Parametro 'alumnoId' es requerido" });
    const items = await ApuntesAlumnos.findAll({ where: { alumnoId, megusta: true } });
    const apunteIds = items.map((it) => it.apunteId);
    return res.json({ apunteIds });
  } catch (error) {
    console.error('Error en /apuntesalumnos/likes:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
