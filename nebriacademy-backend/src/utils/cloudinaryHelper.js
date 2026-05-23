// ── IMPORTACIONES ───────────────────────────────────────────────────────────
const streamifier = require("streamifier");
const cloudinary = require("../routes/cloudinary");

// ── UTILIDADES: cloudinaryHelper ─────────────────────────────────────────────
// Funciones auxiliares para subir archivos y resolver metadatos en Cloudinary

// Sube un buffer de archivo a Cloudinary usando upload_chunked_stream
// Devuelve una promesa con el resultado de Cloudinary (incluyendo secure_url)
function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    // Creamos el stream de subida con las opciones proporcionadas (carpeta, tipo, public_id...)
    const stream = cloudinary.uploader.upload_chunked_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    // Convertimos el buffer en un ReadStream y lo canalizamos al stream de subida
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Extrae el public_id de una URL de Cloudinary para poder borrar el asset posteriormente
// Para archivos raw se conserva la extensión; para image/video se elimina
function extractPublicId(url, resourceType) {
  try {
    const parts = url.split("/");
    // Localizamos el segmento "upload" y saltamos también el segmento de versión que le sigue
    const uploadIdx = parts.indexOf("upload");
    const afterUpload = parts.slice(uploadIdx + 2);
    const publicIdWithExt = afterUpload.join("/");
    // Los recursos raw necesitan la extensión en el public_id; image y video no
    return resourceType === "raw" ? publicIdWithExt : publicIdWithExt.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}

// Detecta el resource_type de Cloudinary a partir del segmento de la URL
// Devuelve 'image', 'video' o 'raw' (fallback para PDFs, ZIPs, etc.)
function getResourceTypeFromUrl(url) {
  if (!url) return 'raw';
  if (url.includes('/image/upload/')) return 'image';
  if (url.includes('/video/upload/')) return 'video';
  return 'raw';
}

module.exports = {
  uploadToCloudinary,
  extractPublicId,
  getResourceTypeFromUrl,
};
