// Importamos las dependencias principales del servidor
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");

// cors permite peticiones desde el frontend (distinto puerto), express.json() procesa cuerpos JSON
app.use(cors());
app.use(express.json());

// Ruta base donde se guardan físicamente los archivos subidos (apuntes, vídeos, ejercicios...)
const assetsRoot = path.join(
  __dirname,
  "..",
  "..",
  "nebriacademy-frontend",
  "src",
  "assets",
);
const assetsDirs = ["Apuntes", "Videos", "Ejercicios", "EjerciciosAlumnos"];

// Al arrancar el servidor, se crean las carpetas de assets si aún no existen
try {
  if (!fs.existsSync(assetsRoot)) fs.mkdirSync(assetsRoot, { recursive: true });
  for (const d of assetsDirs) {
    const dirPath = path.join(assetsRoot, d);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  }
} catch (e) {
  console.error("Error creando carpetas de assets:", e);
}

// Exponemos cada carpeta de assets como una URL pública para que el frontend pueda descargar los archivos
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


// Registramos cada módulo de rutas; Express redirige la petición al archivo correspondiente según el prefijo de la URL
app.use("/administradores", require("./routes/administradores"));
app.use("/alumnos", require("./routes/alumnos"));
app.use("/apuntes", require("./routes/apuntes"));
app.use("/apuntesalumnos", require("./routes/apuntesalumnos"));
app.use("/cursos", require("./routes/cursos"));
app.use("/cursosalumnos", require("./routes/cursosalumnos"));
app.use("/comentarioalumnocurso", require("./routes/comentarioalumnocurso"));
app.use("/ejercicios", require("./routes/ejercicios"));
app.use("/ejerciciosalumnos", require("./routes/ejerciciosalumnos"));
app.use("/jira", require("./routes/jira"));
app.use("/profesores", require("./routes/profesores"));
app.use("/profesorescursos", require("./routes/profesorescursos"));
app.use("/puntuacionesejercicios", require("./routes/puntuacionesejercicios"));
app.use("/usuarios", require("./routes/usuarios"));
app.use("/login", require("./database/login"));
app.use("/videos", require("./routes/videos"));

// Middleware global de errores: si cualquier ruta falla de forma inesperada, devuelve un 500 en lugar de romper el servidor
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err && err.stack ? err.stack : err);
  res.status(500).json({
    error: err && err.message ? err.message : "Error interno del servidor",
  });
});

// Arrancamos el servidor en el puerto 3000
app.listen(3000, () =>
  console.log("Servidor ejecutándose en http://localhost:3000"),
);
