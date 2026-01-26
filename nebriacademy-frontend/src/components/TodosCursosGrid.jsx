import { useEffect, useState } from "react";
import TarjetaCursos from "./TarjetaCursos";

function TodosCursosGrid() {
    const [cursos, setCursos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [profesoresCursos, setProfesoresCursos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        fetch("http://localhost:3000/cursos")
            .then((r) => r.json())
            .then((cData) => {
                setCursos(cData.Cursos);
                return fetch("http://localhost:3000/profesores");
            })
            .then((r) => r.json())
            .then((pData) => {
                setProfesores(pData.Profesores);
                return fetch("http://localhost:3000/profesorescursos");
            })
            .then((r) => r.json())
            .then((pcData) => {
                setProfesoresCursos(pcData.ProfesoresCursos);
            })
            .catch((err) => {
                console.error("Error cargando datos:", err);
                setError("Error al cargar datos");
            })
    }, []);

    const obtenerNombresProfesores = (curso) => {
        const cursoId = curso.id;
        const profesorIds = profesoresCursos
            .filter((pc) => pc.cursoId === cursoId)
            .map((pc) => pc.profesorId);
        const nombres = profesorIds
            .map((id) => {
                const prof = profesores.find((p) => p.id === id);
                return `${prof.nombre} ${prof.apellidos}`;
            });
        return nombres;
    };
    if (error) return <p>{error}</p>;

    return (
        <div className="todos-cursos-grid">
            <aside className="buscador-sidebar">
                <form role="search" className="formulario-busqueda">
                    <input type="search" placeholder="Buscar cursos..." aria-label="Buscar cursos" />
                    <button type="submit">Buscar</button>
                </form>
                <div className="categorias-sidebar">
                    <h3>Categorías</h3>
                    <ul>
                        <li><a href="#">Todas</a></li>
                        <li><a href="#">Programación</a></li>
                        <li><a href="#">Diseño</a></li>
                        <li><a href="#">Ciberseguridad</a></li>
                    </ul>
                </div>
            </aside>
            <main className="cursos-contenedor">
                <h2>Cursos</h2>
                <div className="cursos-grid">
                    {cursos.map((curso) => (
                        <TarjetaCursos
                            key={curso.id}
                            name={curso.nombreCurso}
                            cursoId={curso.id}
                            categoria={`Categoría: ${curso.categoria}`}
                            descripcion={curso.descripcion}
                            profesor={
                                (() => {
                                    const nombres = obtenerNombresProfesores(curso);
                                    const SOP = nombres.length > 1 ? "Profesores" : "Profesor";
                                    return `${SOP}: ${nombres.join(", ")}`;
                                })()
                            }
                            valoracion={`Valoración: ${curso.valoracion}`}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}

export default TodosCursosGrid;