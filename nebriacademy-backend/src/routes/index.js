const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.send("Pagina principal de la API de NebriAcademy"
		+"<br><br>Para poder ver los JSON de cada tabla con todos sus datos, poner en la URL localhost:3000/nombre de la tabla."
		+"<br>Para ver los JSON de un registro en concreto, poner en la URL localhost:3000/nombre de la tabla/id del registro."
		+"<br><br>Tablas disponibles:"
		+"<br>/administradores"
		+"<br>/alumnos"
		+"<br>/apuntes"
		+"<br>/cursos"
		+"<br>/cursosalumnos"
		+"<br>/ejercicios"
		+"<br>/incidencias"
		+"<br>/profesores"
		+"<br>/profesorescursos"
		+"<br>/puntuacionesejercicios"
		+"<br>/usuarios"
		+"<br>/videos");
});

module.exports = router;