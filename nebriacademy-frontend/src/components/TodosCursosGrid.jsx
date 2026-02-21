import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import TarjetaCursos from "./TarjetaCursos";

function TodosCursosGrid() {
  const { state } = useLocation();
  const [data, setData] = useState({
    cursos: [],
    profesores: [],
    categorias: [],
  });
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    category: state?.selectedCategory || "",
    level: "",
    searchTerm: "",
  });

  const NIVELES = ["Básico", "Intermedio", "Avanzado"];

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [respuestaCursos, respuestaProfesores, respuestaCategorias] =
          await Promise.all([
            fetch("http://localhost:3000/cursos").then((respuesta) =>
              respuesta.json(),
            ),
            fetch("http://localhost:3000/profesores").then((respuesta) =>
              respuesta.json(),
            ),
            fetch("http://localhost:3000/cursos/categorias").then((respuesta) =>
              respuesta.json().catch(() => ({ categorias: [] })),
            ),
          ]);

        setData({
          cursos: respuestaCursos.Cursos || [],
          profesores: respuestaProfesores.Profesores || [],
          categorias: respuestaCategorias.categorias || [],
        });
      } catch (error) {
        console.error(error);
        setError("Error al cargar los cursos");
      }
    };
    cargarDatos();
  }, []);

  const getProfesorName = (pid) => {
    const p = data.profesores.find((prof) => prof.id === pid);
    return p ? `Profesor: ${p.nombre} ${p.apellidos}` : "Profesor: Desconocido";
  };

  const updateFilter = (k, v) => setFilters((prev) => ({ ...prev, [k]: v }));

  const filteredCursos = useMemo(() => {
    return data.cursos.filter((c) => {
      if (filters.category && c.categoria !== filters.category) return false;

      if (
        filters.level &&
        (c.nivel || "").toLowerCase() !== filters.level.toLowerCase()
      )
        return false;

      if (
        filters.searchTerm &&
        !(c.nombreCurso || "")
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase())
      )
        return false;

      return true;
    });
  }, [data, filters]);

  if (error) return <p>{error}</p>;

  return (
    <div className="todos-cursos-grid">
      <aside className="buscador-sidebar">
        <form
          className="formulario-busqueda"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="search"
            placeholder="Buscar cursos..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
          />
        </form>

        <div className="categorias-sidebar">
          <h3>Categorías</h3>
          <ul>
            <li>
              <button
                onClick={() => updateFilter("category", "")}
                className={!filters.category ? "activo" : ""}
              >
                Todas
              </button>
            </li>
            {data.categorias.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => updateFilter("category", cat)}
                  className={filters.category === cat ? "activo" : ""}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>

          <h3 className="subtitulo-nivel">Nivel</h3>
          <ul>
            <li>
              <button
                onClick={() => updateFilter("level", "")}
                className={!filters.level ? "activo" : ""}
              >
                Todos
              </button>
            </li>
            {NIVELES.map((n) => (
              <li key={n}>
                <button
                  onClick={() => updateFilter("level", n)}
                  className={filters.level === n ? "activo" : ""}
                >
                  {n}
                </button>
              </li>
            ))}
          </ul>

          <div className="limpiar-filtros">
            <button
              onClick={() =>
                setFilters({ category: "", level: "", searchTerm: "" })
              }
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </aside>

      <main className="cursos-contenedor">
        <h2>Cursos</h2>
        <div className="cursos-grid">
          {filteredCursos.map((c) => (
            <TarjetaCursos
              key={c.id}
              name={c.nombreCurso}
              cursoId={c.id}
              categoria={c.categoria}
              nivel={c.nivel}
              descripcion={c.descripcion}
              profesor={getProfesorName(c.profesor)}
              valoracion={c.valoracion}
              imagen={c.imagen}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default TodosCursosGrid;
