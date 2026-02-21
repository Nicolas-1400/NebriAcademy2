// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import TarjetaCursos from "./TarjetaCursos";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// TodosCursosGrid: Biblioteca global de cursos interactiva.
// Contiene la funcionalidad para hacer fetch de múltiples colecciones (cursos, especialidades) de forma simultánea.
function TodosCursosGrid() {
  const { state } = useLocation();

  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================

  // Matriz consolidada de los datos base que alimentarán todo el ecosistema de la página
  const [data, setData] = useState({
    cursos: [],
    profesores: [],
    categorias: [],
  });

  const [error, setError] = useState(null);

  // Estados unificados para los diferentes ejes de filtrado.
  // Rescata 'category' desde el objeto de redirección del router si se entró cliqueando en una categoría rápida
  const [filters, setFilters] = useState({
    category: state?.selectedCategory || "",
    level: "",
    searchTerm: "",
  });

  // Inventario duro para los niveles de dificultad que maneja la plataforma
  const NIVELES = ["Básico", "Intermedio", "Avanzado"];

  // ==========================================
  // 4. EFECTOS
  // ==========================================

  // Realiza peticiones asincrónicas en paralelo para abaratar tiempo de red empleando Promise.all
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
              // Si falla el endpoint de categorías, previene que colapse la interfaz total
              respuesta.json().catch(() => ({ categorias: [] })),
            ),
          ]);

        // Carga y vinculación de resultados hacia el estado principal
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

  // ==========================================
  // 5. FUNCIONES AUXILIARES Y FILTRADO (USEMEMO)
  // ==========================================

  // Vincula llave de profesor (Id) al valor humano de su Nombre Completo extraído de la data matriz
  const getProfesorName = (pid) => {
    const p = data.profesores.find((prof) => prof.id === pid);
    return p ? `Profesor: ${p.nombre} ${p.apellidos}` : "Profesor: Desconocido";
  };

  // Mutador atómico de las propiedades que habitan en el estado filters
  const updateFilter = (k, v) => setFilters((prev) => ({ ...prev, [k]: v }));

  // useMemo: Actúa como cache o filtro procesado; únicamente iterará toda la colección del arreglo
  // si un recurso vital (los cursos bajados o los botones de selector) fue alterado.
  const filteredCursos = useMemo(() => {
    return data.cursos.filter((c) => {
      // Regla de descarte 1: Si hay filtro de categoría y no empata
      if (filters.category && c.categoria !== filters.category) return false;

      // Regla de descarte 2: Si hay filtro de nivel y no empata con la propiedad convertida
      if (
        filters.level &&
        (c.nivel || "").toLowerCase() !== filters.level.toLowerCase()
      )
        return false;

      // Regla de descarte 3: Si se tipeó texto y la subcadena no se aloja en el nombre del curso
      if (
        filters.searchTerm &&
        !(c.nombreCurso || "")
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase())
      )
        return false;

      // Conserva el curso para el mapa de renderizado final
      return true;
    });
  }, [data, filters]);

  // ==========================================
  // 6. RENDERIZADO
  // ==========================================
  if (error) return <p>{error}</p>;

  return (
    <div className="todos-cursos-grid">
      {/* ===== SIDEBAR (PANEL IZQUIERDO) ===== */}
      <aside className="buscador-sidebar">
        {/* Búsqueda libre */}
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
          {/* Categorías construidas por map de BBDD */}
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

          {/* Niveles estáticos */}
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

          {/* Reset Global de Filtros */}
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

      {/* ===== CUADRÍCULA DE TARJETAS (PANEL DERECHO) ===== */}
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

// ==========================================
// 7. EXPORTACIONES
// ==========================================
export default TodosCursosGrid;
