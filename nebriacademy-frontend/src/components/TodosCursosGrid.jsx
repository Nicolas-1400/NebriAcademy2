import { useEffect, useState } from "react";
import TarjetaCursos from "./TarjetaCursos";

function TodosCursosGrid() {
    const [cursos, setCursos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedNivel, setSelectedNivel] = useState("");

    // Opciones coherentes con AddCursoGrid.jsx
    const CATEGORIAS = ["Programacion", "Diseno", "Ciberseguridad", "BDD", "Marketing"];
    const NIVELES = ["Básico", "Intermedio", "Avanzado"];

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
            })
            
            .catch((err) => {
                console.error("Error cargando datos:", err);
                setError("Error al cargar datos");
            })
    }, []);

    // Filtrado sencillo: aplica los filtros si están seleccionados
    const filteredCursos = cursos.filter((curso) => {
        if (selectedCategory && curso.categoria !== selectedCategory) return false;
        if (selectedNivel && curso.nivel !== selectedNivel) return false;
        return true;
    });
    const obtenerNombreProfesor = (curso) => {
        const profId = curso.profesor;
        if (!profId) return "Profesor: Desconocido";
        const prof = profesores.find((p) => p.id === profId);
        if (!prof) return "Profesor: Desconocido";
        return `Profesor: ${prof.nombre} ${prof.apellidos}`;
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
                        <li>
                            <button
                                onClick={() => setSelectedCategory("")}
                                className={selectedCategory === "" ? "activo" : ""}
                            >
                                Todas
                            </button>
                        </li>
                        {CATEGORIAS.map((cat) => (
                            <li key={cat}>
                                <button
                                    onClick={() => setSelectedCategory(cat)}
                                    className={selectedCategory === cat ? "activo" : ""}
                                >
                                    {cat === "Programacion" ? "Programación" : cat === "Diseno" ? "Diseño" : cat}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <h3 className="subtitulo-nivel">Nivel</h3>
                    <ul>
                        <li>
                            <button
                                onClick={() => setSelectedNivel("")}
                                className={selectedNivel === "" ? "activo" : ""}
                            >
                                Todos
                            </button>
                        </li>
                        {NIVELES.map((n) => (
                            <li key={n}>
                                <button
                                    onClick={() => setSelectedNivel(n)}
                                    className={selectedNivel === n ? "activo" : ""}
                                >
                                    {n}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="limpiar-filtros">
                        <button onClick={() => { setSelectedCategory(""); setSelectedNivel(""); }}>Limpiar filtros</button>
                    </div>
                </div>
            </aside>
            <main className="cursos-contenedor">
                <h2>Cursos</h2>
                <div className="cursos-grid">
                    {filteredCursos.map((curso) => (
                        <TarjetaCursos
                            key={curso.id}
                            name={curso.nombreCurso}
                            cursoId={curso.id}
                            categoria={`Categoría: ${curso.categoria}`}
                            descripcion={curso.descripcion}
                            profesor={obtenerNombreProfesor(curso)}
                            valoracion={`Valoración: ${curso.valoracion}`}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}

export default TodosCursosGrid;