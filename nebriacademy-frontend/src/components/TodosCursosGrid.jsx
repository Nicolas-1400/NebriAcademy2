import TarjetaCursos from "./TarjetaCursos";

function TodosCursosGrid() {

    const cursos = [
        {name: "curso1", cursoId: 1, categoria: "programacion", descripcion: "descripcion1", profesor: "profesor1", valoracion: 4.5},
        {name: "curso2", cursoId: 2, categoria: "programacion", descripcion: "descripcion2", profesor: "profesor2", valoracion: 4.0},
        {name: "curso3", cursoId: 3, categoria: "programacion", descripcion: "descripcion3", profesor: "profesor3", valoracion: 5.0},
        {name: "curso4", cursoId: 4, categoria: "programacion", descripcion: "descripcion4", profesor: "profesor4", valoracion: 3.5},
        {name: "curso5", cursoId: 1, categoria: "programacion", descripcion: "descripcion5", profesor: "profesor1", valoracion: 4.5},
        {name: "curso6", cursoId: 2, categoria: "programacion", descripcion: "descripcion6", profesor: "profesor2", valoracion: 4.0},
        {name: "curso7", cursoId: 3, categoria: "programacion", descripcion: "descripcion7", profesor: "profesor3", valoracion: 5.0},
        {name: "curso8", cursoId: 4, categoria: "programacion", descripcion: "descripcion8", profesor: "profesor4", valoracion: 3.5},

    ];

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
                    <li><a href="#">Marketing</a></li>
                </ul>
            </div>
        </aside>
        <main className="cursos-contenedor">
            <h2>Cursos</h2>
            <div className="cursos-grid">
                {cursos.map(curso => (
                    <TarjetaCursos
                        key={curso.cursoId}
                        name={curso.name}
                        cursoId={curso.cursoId}
                        categoria={`Categoría: ${curso.categoria}`}
                        descripcion={curso.descripcion}
                        profesor={`Profesor: ${curso.profesor}`}
                        valoracion={`Valoración: ${curso.valoracion}`}
                    />
                ))}
            </div>
        </main>
    </div>
  )
}

export default TodosCursosGrid