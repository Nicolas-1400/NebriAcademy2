// ==========================================
// 1. IMPORTACIONES
// ==========================================
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const fs = require("fs");

// ==========================================
// 2. MIDDLEWARES GLOBALES
// ==========================================
// Habilita cabeceras de cors y activa el parser interno de JSON.
app.use(cors());
app.use(express.json());

// ==========================================
// 3. CONFIGURACIÓN DE GESTIÓN DE ARCHIVOS (ASSETS)
// ==========================================
// Resuelve combinando partes estáticas en path join absolutos.
const assetsRoot = path.join(
  __dirname,
  "..",
  "..",
  "nebriacademy-frontend",
  "src",
  "assets",
);
const assetsDirs = ["Apuntes", "Videos", "Ejercicios", "EjerciciosAlumnos"];

try {
  // Comprueba si el directorio está presente o levanta un mkdirSync con recursividad.
  if (!fs.existsSync(assetsRoot)) fs.mkdirSync(assetsRoot, { recursive: true });
  // Escanea variables repetitivas iterándolas.
  for (const d of assetsDirs) {
    const dirPath = path.join(assetsRoot, d);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  }
} catch (e) {
  // Loguea trazas internas sin tumbar el server local.
  console.error("Error creando carpetas de assets:", e);
}

// Declara las rutas para consumo estático montando static handler.
app.use("/apuntes/files", express.static(path.join(assetsRoot, "Apuntes")));
app.use("/videos/files", express.static(path.join(assetsRoot, "Videos")));
app.use(
  "/ejercicios/files",
  express.static(path.join(assetsRoot, "Ejercicios")),
);
app.use(
  "/ejerciciosalumnos/files",
  express.static(path.join(assetsRoot, "EjerciciosAlumnos")),
);

// ==========================================
// 4. ENRUTADOR DE MODELOS (ENDPOINTS)
// ==========================================
// Exige las instancias del enrutador mapeando los endpoints absolutos.
app.use("/", require("./routes/index"));
app.use("/administradores", require("./routes/administradores"));
app.use("/alumnos", require("./routes/alumnos"));
app.use("/apuntes", require("./routes/apuntes"));
app.use("/apuntesalumnos", require("./routes/apuntesalumnos"));
app.use("/cursos", require("./routes/cursos"));
app.use("/cursosalumnos", require("./routes/cursosalumnos"));
app.use("/comentarioalumnocurso", require("./routes/comentarioalumnocurso"));
app.use("/ejercicios", require("./routes/ejercicios"));
app.use("/ejerciciosalumnos", require("./routes/ejerciciosalumnos"));
app.use("/incidencias", require("./routes/incidencias"));
app.use("/profesores", require("./routes/profesores"));
app.use("/profesorescursos", require("./routes/profesorescursos"));
app.use("/puntuacionesejercicios", require("./routes/puntuacionesejercicios"));
app.use("/usuarios", require("./routes/usuarios"));
app.use("/login", require("./database/login"));
app.use("/videos", require("./routes/videos"));

// ==========================================
// 5. MANEJADOR GLOBAL DE ERRORES SECUNDARIO
// ==========================================
// Engancha el next como middleware para retornar logs error 500 estándar.
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err && err.stack ? err.stack : err);
  res.status(500).json({
    error: err && err.message ? err.message : "Error interno del servidor",
  });
});

// ==========================================
// 6. INICIALIZACIÓN DEL SERVIDOR HTTP
// ==========================================
// Aplica app listen sobre el puerto para invocar la escucha del network general.
app.listen(3000, () =>
  console.log("Servidor ejecutándose en http://localhost:3000"),
);
