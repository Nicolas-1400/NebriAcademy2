const Administradores = require("../models/Administradores.js");

module.exports = {
  listAll: async (req, res) => {
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
  },

  getById: async (req, res) => {
    try {
      const admin = await Administradores.findByPk(req.params.id);
      admin ? res.json(admin) : res.status(404).json({ error: "No encontrado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error de servidor" });
    }
  },

  create: async (req, res) => {
    try {
      const nuevo = await Administradores.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creando administrador" });
    }
  },

  update: async (req, res) => {
    try {
      const admin = await Administradores.findByPk(req.params.id);
      if (!admin) return res.status(404).json({ error: "No encontrado" });

      const actualizado = await admin.update(req.body);
      res.json(actualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error actualizando" });
    }
  },

  remove: async (req, res) => {
    try {
      const filas = await Administradores.destroy({ where: { id: req.params.id } });
      filas ? res.json({ mensaje: "Eliminado" }) : res.status(404).json({ error: "No encontrado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error eliminando" });
    }
  },
};
