// Importamos las dependencias principales del servidor
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const app = express();

// cors permite peticiones desde el frontend (distinto puerto), express.json() procesa cuerpos JSON
app.use(cors());
app.use(express.json());

// Los archivos (apuntes, vídeos, ejercicios) se almacenan en Cloudinary.
// Ya no se necesitan carpetas locales ni rutas express.static para servirlos.


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
app.use("/notificaciones", require("./routes/notificaciones"));

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
