const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const fs = require("fs");

// Configuración de Middlewares

app.use(cors());
app.use(express.json());

// Configuración de Assets
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
  if (!fs.existsSync(assetsRoot)) fs.mkdirSync(assetsRoot, { recursive: true });
  for (const d of assetsDirs) {
    const dirPath = path.join(assetsRoot, d);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  }
} catch (e) {
  console.error("Error creando carpetas de assets:", e);
}

// Configuración de Archivos Estáticos
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

// Configuración de Rutas
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

// Manejo de Errores
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err && err.stack ? err.stack : err);
  res.status(500).json({
    error: err && err.message ? err.message : "Error interno del servidor",
  });
});

// Inicialización del Servidor
app.listen(3000, () =>
  console.log("Servidor ejecutándose en http://localhost:3000"),
);
