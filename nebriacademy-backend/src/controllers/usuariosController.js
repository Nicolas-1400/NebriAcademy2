// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const Usuarios = require("../models/Usuarios.js");
const Alumnos = require("../models/Alumnos.js");
const Profesores = require("../models/Profesores.js");
const Administradores = require("../models/Administradores.js");

// ── CONTROLADOR: usuarios ────────────────────────────────────────────────────
// Operaciones CRUD sobre el modelo Usuarios con resolución dinámica por tipo
// Devuelve el modelo específico (Alumnos, Profesores o Administradores) según el tipo de usuario
const getModelByType = (tipo) => {
  switch (tipo) {
    case "alumno":
      return Alumnos;
    case "profesor":
      return Profesores;
    case "administrador":
      return Administradores;
    default:
      return null;
  }
};

// Listar todos los usuarios
exports.listAll = async (req, res) => {
  try {
    const all = await Usuarios.findAll();
    res.json({ "Numero de usuarios": all.length, Usuarios: all });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Obtener usuario por id usando el query param tipo para resolver el modelo correcto
exports.getById = async (req, res) => {
  try {
    const { tipo } = req.query;
    if (!tipo) return res.status(400).json({ error: "Falta param tipo" });

    const Model = getModelByType(tipo);
    if (!Model) return res.status(400).json({ error: "Tipo inválido" });

    const u = await Model.findByPk(req.params.id);
    u ? res.json(u) : res.status(404).json({ error: "No encontrado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Crear un nuevo usuario base (sin datos de perfil específicos)
exports.create = async (req, res) => {
  try {
    const nuevo = await Usuarios.create(req.body);
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Actualizar usuario resolviendo el modelo por tipo y actualizando la entidad correspondiente
exports.update = async (req, res) => {
  try {
    const { tipo } = req.body;
    const Model = getModelByType(tipo);

    if (!Model) return res.status(400).json({ error: "Tipo inválido" });

    const u = await Model.findByPk(req.params.id);
    if (!u) return res.status(404).json({ error: "No encontrado" });

    const updated = await u.update(req.body);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

// Eliminar usuario base por id
exports.remove = async (req, res) => {
  try {
    const u = await Usuarios.findByPk(req.params.id);
    if (!u) return res.status(404).json({ error: "No encontrado" });

    await u.destroy();
    res.json({ mensaje: "Usuario eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};
