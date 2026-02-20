const express = require("express");
const router = express.Router();
const Administradores = require("../models/Administradores.js");

// ==========================================
// 1. Rutas de Obtención
// ==========================================
// Devuelve el grupo de registros usando findAll en formato de arreglo.
router.get("/", async (req, res) => {
  try {
    const todos = await Administradores.findAll();
    res.json({
      "Numero de administradores": todos.length,
      Administradores: todos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error de servidor" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const admin = await Administradores.findByPk(req.params.id);
    admin ? res.json(admin) : res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error de servidor" });
  }
});

// ==========================================
// 2. Rutas de Creación
// ==========================================
// Llama a Administradores.create().
router.post("/", async (req, res) => {
  try {
    const nuevo = await Administradores.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando administrador" });
  }
});

// ==========================================
// 3. Rutas de Actualización
// ==========================================
// Localiza el registro mediante findByPk y aplica actualización.
router.put("/:id", async (req, res) => {
  try {
    const admin = await Administradores.findByPk(req.params.id);
    if (!admin) return res.status(404).json({ error: "No encontrado" });

    const actualizado = await admin.update(req.body);
    res.json(actualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando" });
  }
});

// ==========================================
// 4. Rutas de Eliminación
// ==========================================
// Ejecuta la destrucción del registro pasando la id recibida.
router.delete("/:id", async (req, res) => {
  try {
    const filas = await Administradores.destroy({
      where: { id: req.params.id },
    });
    filas
      ? res.json({ mensaje: "Eliminado" })
      : res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando" });
  }
});

module.exports = router;
