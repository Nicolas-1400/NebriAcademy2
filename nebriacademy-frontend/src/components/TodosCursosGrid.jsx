import Nav from "./Nav";
import Footer from "./Footer";


function TodosCursosGrid() {

    const cursosEnProceso = [
        { nombre: "React Avanzado", valoracion: 4.5, profesor: "Juan García" },
        { nombre: "JavaScript ES6+", valoracion: 4.5, profesor: "María López" },
        { nombre: "Node.js Fundamentals", valoracion: 4.5, profesor: "Carlos Rodríguez" }
    ];
    const cursosGuardados = [
        { nombre: "Python para Ciencia de Datos", valoracion: 4.5, profesor: "Ana Martínez" },
        { nombre: "UI/UX Design", valoracion: 4.5, profesor: "Elena Sánchez" }
    ];
    const cursosCompletados = [
        { nombre: "HTML & CSS Básico", fechaFinalizacion: "15/01/2026", calificacion: "9.5" },
        { nombre: "Git & GitHub", fechaFinalizacion: "10/01/2026", calificacion: "8.7" }
    ];
    const profesoresSeguidos = [
        { nombre: "Juan García", especialidad: "Frontend Development" },
        { nombre: "María López", especialidad: "Full Stack" },
        { nombre: "Carlos Rodríguez", especialidad: "Backend Development" }
    ];
    const apuntesGuardados = [
        { titulo: "Hooks en React", curso: "React Avanzado" },
        { titulo: "Async/Await", curso: "JavaScript ES6+" },
        { titulo: "Middlewares", curso: "Node.js Fundamentals" }
    ];

  return (
    <div>
        <Nav />
        <div className="contenedor-cursos">
            <h1>Cursos</h1>
            <div className="contenedor-slides-cursos">
                <h2>Cursos en proceso</h2>
                <div className="slide-cursos-en-proceso">
                    {cursosEnProceso.map((curso, index) => (
                        <div key={index}>
                            <h3>{curso.nombre}</h3>
                            <p>Progreso: {curso.progreso}</p>
                            <p>Profesor: {curso.profesor}</p>
                        </div>
                    ))}
                </div>
                <h2>Cursos guardados</h2>
                <div className="slide-cursos-guardados">
                    {cursosGuardados.map((curso, index) => (
                        <div key={index}>
                            <h3>{curso.nombre}</h3>
                            <p>Profesor: {curso.profesor}</p>
                        </div>
                    ))}
                </div>
                <h2>Cursos completados</h2>
                <div className="slide-cursos-completados">
                    {cursosCompletados.map((curso, index) => (
                        <div key={index}>
                            <h3>{curso.nombre}</h3>
                            <p>Finalizado: {curso.fechaFinalizacion}</p>
                            <p>Calificación: {curso.calificacion}</p>
                        </div>
                    ))}                    
                </div>
                <h2>Profesores a los que sigues</h2>
                <div className="slide-profesores-seguidos">
                    {profesoresSeguidos.map((profesor, index) => (
                        <div key={index}>
                            <h3>{profesor.nombre}</h3>
                            <p>{profesor.especialidad}</p>
                        </div>
                    ))}                    
                </div>
                <h2>Apuntes guardados</h2>
                <div className="slide-apuntes-guardados">
                    {apuntesGuardados.map((apunte, index) => (
                        <div key={index}>
                            <h3>{apunte.titulo}</h3>
                            <p>Curso: {apunte.curso}</p>
                            <p>Fecha: {apunte.fecha}</p>
                        </div>
                    ))}                    
                </div>
            </div>
        </div>

        <Footer />        
    </div>
  )
}

export default TodosCursosGrid