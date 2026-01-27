const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


// Rutas por recurso
app.use('/', require('./routes/index'));
app.use('/administradores', require('./routes/administradores'));
app.use('/alumnos', require('./routes/alumnos'));
app.use('/apuntes', require('./routes/apuntes'));
app.use('/cursos', require('./routes/cursos'));
app.use('/addCurso', require('./database/addCurso'));
app.use('/cursosalumnos', require('./routes/cursosalumnos'));
app.use('/ejercicios', require('./routes/ejercicios'));
app.use('/incidencias', require('./routes/incidencias'));
app.use('/profesores', require('./routes/profesores'));
app.use('/profesorescursos', require('./routes/profesorescursos'));
app.use('/puntuacionesejercicios', require('./routes/puntuacionesejercicios'));
app.use('/usuarios', require('./routes/usuarios'));
app.use('/login', require('./database/login'));
app.use('/registerAlumnoExterno', require('./database/registerAlumnoExterno'));
app.use('/registerProfesor', require('./database/registerProfesor'));
app.use('/verificacionnebrija', require('./database/registerUsuarioNebrija'));
app.use('/videos', require('./routes/videos'));

// Inica el servidor
app.listen(3000, () => console.log('Servidor ejecutándose en http://localhost:3000'));