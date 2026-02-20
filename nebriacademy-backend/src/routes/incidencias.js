const express = require("express");
const router = express.Router();
const Incidencias = require("../models/Incidencias.js");

// ==========================================
// 1. Rutas de Obtención
// ==========================================
// Obtiene todas las incidencias de la base de datos.
router.get("/", async (req, res) => {
  try {
    // Usa findAll para traer todas las incidencias
    const all = await Incidencias.findAll();
    // Las devuelve como JSON incluyendo el conteo total
    res.json({ "Numero de incidencias": all.length, Incidencias: all });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const i = await Incidencias.findByPk(req.params.id);
    i ? res.json(i) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 2. Rutas de Creación
// ==========================================
// Inserta una nueva incidencia en la base de datos utilizando los datos del cuerpo de la petición.
router.post("/", async (req, res) => {
  try {
    const created = await Incidencias.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error creando" });
  }
});

// ==========================================
// 3. Rutas de Actualización
// ==========================================
// Actualiza una incidencia existente según el ID proporcionado en los parámetros de la ruta.
router.put("/:id", async (req, res) => {
  try {
    // Busca el registro por el ID enviado en la ruta
    const i = await Incidencias.findByPk(req.params.id);
    if (!i) return res.status(404).json({ error: "No encontrado" });

    // Actualiza el objeto usando req.body
    const updated = await i.update(req.body);
    // Manda de vuelta el objeto actualizado
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Error actualizando" });
  }
});

// ==========================================
// 4. Rutas de Eliminación
// ==========================================
// Elimina un registro de incidencia mediante el ID proporcionado.
router.delete("/:id", async (req, res) => {
  try {
    // Borra directamente el registro que concuerde con req.params.id
    const r = await Incidencias.destroy({ where: { id: req.params.id } });
    // Verifica si la instrucción afectó alguna fila
    r
      ? res.json({ mensaje: "Eliminado" })
      : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Error eliminando" });
  }
});

module.exports = router;
