const express = require("express");
const router = express.Router();
const PuntuacionesEjercicios = require("../models/PuntuacionesEjercicios.js");

// ==========================================
// 1. Rutas de Obtención
// ==========================================
// Obtiene todos los registros de la tabla de puntuaciones.
router.get("/", async (req, res) => {
  try {
    // Llama a findAll para leer la tabla
    const all = await PuntuacionesEjercicios.findAll();
    // Responde con el objeto JSON que incluye el array de resultados
    res.json({
      "Numero de puntuacionesEjercicios": all.length,
      PuntuacionesEjercicios: all,
    });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const p = await PuntuacionesEjercicios.findByPk(req.params.id);
    p ? res.json(p) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 2. Rutas de Creación
// ==========================================
// Inserta un nuevo registro de puntuación en la base de datos.
router.post("/", async (req, res) => {
  try {
    // Crea el registro con la información provista en el body
    const created = await PuntuacionesEjercicios.create(req.body);
    // Retorna el registro devuelto por la base de datos
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 3. Rutas de Actualización
// ==========================================
// Actualiza un registro de puntuación existente a través de su ID.
router.put("/:id", async (req, res) => {
  try {
    // Verifica que el recurso exista mediante su Primary Key
    const p = await PuntuacionesEjercicios.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: "No encontrado" });

    // Modifica las propiedades enviadas en req.body
    const updated = await p.update(req.body);
    // Devuelve el objeto ya modificado
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 4. Rutas de Eliminación
// ==========================================
// Elimina un registro de puntuación específico.
router.delete("/:id", async (req, res) => {
  try {
    // Encuentra el registro por medio del ID
    const p = await PuntuacionesEjercicios.findByPk(req.params.id);
    if (!p) return res.status(404).json({ error: "No encontrado" });

    // Llama al método destroy en el modelo para eliminarlo
    await p.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
