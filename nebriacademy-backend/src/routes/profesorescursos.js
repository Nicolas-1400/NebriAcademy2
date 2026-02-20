const express = require("express");
const router = express.Router();
const ProfesoresCursos = require("../models/ProfesoresCursos.js");

// ==========================================
// 1. Rutas de Obtención
// ==========================================
// Obtiene todos los registros de la tabla ProfesoresCursos.
router.get("/", async (req, res) => {
  try {
    // Obtiene todos los registros usando findAll
    const all = await ProfesoresCursos.findAll();
    // Devuelve la longitud del array y los datos en formato JSON
    res.json({
      "Numero de profesoresCursos": all.length,
      ProfesoresCursos: all,
    });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const r = await ProfesoresCursos.findByPk(req.params.id);
    r ? res.json(r) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 2. Rutas de Creación
// ==========================================
// Crea un nuevo registro en la tabla con los datos proporcionados en el cuerpo de la petición.
router.post("/", async (req, res) => {
  try {
    // Pasa req.body al método create para insertar un registro
    const created = await ProfesoresCursos.create(req.body);
    // Devuelve un status 201 y el objeto JSON creado
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 3. Rutas de Actualización
// ==========================================
router.put("/:id", async (req, res) => {
  try {
    // Verifica si la id demandada consta como válida.
    const r = await ProfesoresCursos.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "No encontrado" });

    // Carga encima del objeto alojado las nuevas configuraciones.
    const updated = await r.update(req.body);
    // Libera la confirmación emitiendo el componente sustituido.
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

// ==========================================
// 4. Rutas de Eliminación
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    // Busca el registro asociado al id
    const r = await ProfesoresCursos.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "No encontrado" });

    // Ejecuta el método destroy para borrar la entrada de la base de datos
    await r.destroy();
    res.json({ mensaje: "Eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
