// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../config/api";
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import TarjetaCursos from "./TarjetaCursos";
import useAuthStore from "../store/useAuthStore";
import Eliminar from "../assets/Iconos/Eliminar.png";
import useToastStore from "../store/toastStore";
import useModalStore from "../store/modalStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Listado de todos los cursos con filtros por categoría, nivel y buscador de texto
function TodosCursosGrid() {
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // Leemos la categoría preseleccionada si venimos del HomeFeed pulsando una categoría
  const { state } = useLocation();
  const { tipo, user } = useAuthStore();
  const { addToast } = useToastStore();
  const { showConfirm } = useModalStore();
  const [data, setData] = useState({
    cursos: [],
    profesores: [],
    categorias: [],
  });
  const [error, setError] = useState(null);

  // Estado de los filtros: categoría, nivel y buscador de texto
  const [filters, setFilters] = useState({
    category: state?.selectedCategory || "",
    level: "",
    searchTerm: "",
  });

  const NIVELES = ["Básico", "Intermedio", "Avanzado"];

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Al montar el componente, cargamos cursos, profesores y categorías en paralelo
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [respuestaCursos, respuestaProfesores, respuestaCategorias] =
          await Promise.all([
            fetch(`${API_URL}/cursos`).then((respuesta) =>
              respuesta.json(),
            ),
            fetch(`${API_URL}/profesores`).then((respuesta) =>
              respuesta.json(),
            ),
            fetch(`${API_URL}/cursos/categorias`).then((respuesta) =>
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

  // Busca el nombre del profesor a partir del ID del curso para mostrarlo en la tarjeta
  const getProfesorName = (pid) => {
    const p = data.profesores.find((prof) => prof.id === pid);
    return p ? `Profesor: ${p.nombre} ${p.apellidos}` : "Profesor: Desconocido";
  };

  // Elimina un curso completo con confirmación (solo admin)
  const handleDeleteCurso = async (cursoId) => {
    const confirmed = await showConfirm("¿Eliminar este curso y todo su contenido? Esta acción no se puede deshacer.", "Eliminar Curso");
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_URL}/cursos/${cursoId}`, { method: "DELETE" });
      if (res.ok) {
        setData((prev) => ({ ...prev, cursos: prev.cursos.filter((c) => c.id !== cursoId) }));
        addToast("Curso eliminado correctamente", "success");
      } else {
        addToast("Error al eliminar el curso", "error");
      }
    } catch (e) {
      console.error(e);
      addToast("Error de red", "error");
    }
  };

  // Actualiza un único campo de los filtros sin alterar los demás
  const updateFilter = (k, v) => setFilters((prev) => ({ ...prev, [k]: v }));

  // Lista de cursos filtrada según los criterios activos; se recalcula solo cuando cambien datos o filtros
  const filteredCursos = useMemo(() => {
    return data.cursos.filter((c) => {
      // Si es alumno vinculado, ocultar los cursos de su profesor vinculado
      if (user?.esVinculado && user?.profesorVinculadoId && c.profesor === user.profesorVinculadoId)
        return false;

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
  }, [data, filters, user]);

  if (error) return <p>{error}</p>;

  return (
    <div className="todos-cursos-grid">
      {/* Sidebar lateral con buscador y filtros de categoría y nivel */}
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

      {/* Grid principal con las tarjetas de los cursos filtrados */}
      <main className="cursos-contenedor">
        <h2>Cursos</h2>
        <div className="cursos-grid">
          {filteredCursos.map((c) => (
            <div key={c.id} className="tarjeta-curso-wrapper">
              <TarjetaCursos
                name={c.nombreCurso}
                cursoId={c.id}
                categoria={c.categoria}
                nivel={c.nivel}
                descripcion={c.descripcion}
                profesor={getProfesorName(c.profesor)}
                valoracion={c.valoracion}
                imagen={c.imagen}
                isAdmin={tipo === "administrador"}
                onAdminDelete={() => handleDeleteCurso(c.id)}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default TodosCursosGrid;
