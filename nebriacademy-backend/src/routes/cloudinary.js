// ── CLOUDINARY CONFIG ────────────────────────────────────────────────────────
// Inicializa y exporta la instancia de Cloudinary v2 configurada con las
// credenciales del .env. Importar este módulo desde cualquier ruta de Express.
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
