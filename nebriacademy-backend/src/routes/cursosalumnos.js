const express = require("express");
const router = express.Router();
const CursosAlumnos = require("../models/CursosAlumnos.js");

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
