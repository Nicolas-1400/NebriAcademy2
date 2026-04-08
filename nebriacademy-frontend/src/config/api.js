// URL base del backend.
// En producción, se usa la variable de entorno VITE_API_URL (configurada en Vercel).
// En local, usa localhost:3000 por defecto.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
