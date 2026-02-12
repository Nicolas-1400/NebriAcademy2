const express = require('express');
const router = express.Router();
const EjerciciosAlumnos = require('../models/EjerciciosAlumnos');
const Ejercicios = require('../models/Ejercicios');
const Alumnos = require('../models/Alumnos');
const multer = require('multer');
const path = require('path');

// Multer: guarda en la carpeta de assets del frontend (EjerciciosAlumnos)
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', '..', 'nebriacademy-frontend', 'src', 'assets', 'EjerciciosAlumnos'),
  filename: (req, file, cb) => {
    // Guardar con el nombre original del archivo
    cb(null, path.basename(file.originalname));
  },
});

const upload = multer({ storage });

// Obtener todos
router.get('/', (req, res) => {
  try {
    EjerciciosAlumnos.findAll().then((resultado) => {
      const parsed = resultado.map(r => r.toJSON());
      res.json({ "Numero de registros": parsed.length, registros: parsed });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener por ID
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    EjerciciosAlumnos.findAll().then((resultado) => {
      const registro = resultado.find((r) => r.id === id);
      if (registro) {
        res.json(registro.toJSON());
      } else {
        res.status(404).json({ error: 'Registro no encontrado' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear (subida de un archivo)
router.post('/', upload.single('archivo'), async (req, res) => {
  try {
    const ejercicioId = req.body.ejercicioId ? parseInt(req.body.ejercicioId) : null;
    const alumnoId = req.body.alumnoId ? parseInt(req.body.alumnoId) : null;

    if (!ejercicioId || !alumnoId) {
      return res.status(400).json({ error: 'Campos ejercicioId y alumnoId son requeridos' });
    }

    const ejercicio = await Ejercicios.findByPk(ejercicioId);
    const alumno = await Alumnos.findByPk(alumnoId);
    if (!ejercicio) return res.status(400).json({ error: 'ejercicioId no válido' });
    if (!alumno) return res.status(400).json({ error: 'alumnoId no válido' });

    const archivo = req.file ? req.file.filename : null;

    const nuevo = await EjerciciosAlumnos.create({ ejercicioId, alumnoId, archivo });
    return res.status(201).json({ id: nuevo.id, archivo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar por ID (puede enviar nuevo archivo o campos en body)
router.put('/:id', upload.single('archivo'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    EjerciciosAlumnos.findAll().then(async (resultado) => {
      const registro = resultado.find((r) => r.id === id);
      if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });

      const updates = {};
      if (req.body.ejercicioId) updates.ejercicioId = parseInt(req.body.ejercicioId);
      if (req.body.alumnoId) updates.alumnoId = parseInt(req.body.alumnoId);

      if (req.file) {
        updates.archivo = req.file.filename;
      } else if (req.body.archivo) {
        updates.archivo = String(req.body.archivo);
      }

      registro.update(updates).then(updated => {
        res.json(updated.toJSON());
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar por ID
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    EjerciciosAlumnos.findAll().then((resultado) => {
      const registro = resultado.find((r) => r.id === id);
      if (registro) {
        registro.destroy().then(() => res.json({ mensaje: 'Registro eliminado' }));
      } else {
        res.status(404).json({ error: 'Registro no encontrado' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
