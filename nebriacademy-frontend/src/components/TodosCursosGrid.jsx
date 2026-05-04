// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../config/api";
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import TarjetaCursos from "./TarjetaCursos";
import SearchSidebar from "./SearchSidebar";
import useAuthStore from "../store/useAuthStore";
import Eliminar from "../assets/Iconos/Eliminar.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Listado de todos los cursos con filtros por categoría, nivel y buscador de texto
function TodosCursosGrid() {
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // Leemos la categoría preseleccionada si venimos del HomeFeed pulsando una categoría
  const { state } = useLocation();
  const { tipo, user } = useAuthStore();
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
    if (!window.confirm("¿Eliminar este curso y todo su contenido? Esta acción no se puede deshacer.")) return;
    try {
      const res = await fetch(`${API_URL}/cursos/${cursoId}`, { method: "DELETE" });
      if (res.ok) {
        setData((prev) => ({ ...prev, cursos: prev.cursos.filter((c) => c.id !== cursoId) }));
      } else {
        alert("Error al eliminar el curso");
      }
    } catch (e) {
      console.error(e);
      alert("Error de red");
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

  // ── Configuración del SearchSidebar ──────────────────────────────────────
  const filterGroups = [
    {
      label: "Categorías",
      key: "category",
      options: [
        { label: "Todas", value: "" },
        ...data.categorias.map((cat) => ({ label: cat, value: cat })),
      ],
    },
    {
      label: "Nivel",
      key: "level",
      options: [
        { label: "Todos", value: "" },
        ...NIVELES.map((n) => ({ label: n, value: n })),
      ],
    },
  ];

  if (error) return <p>{error}</p>;

  return (
    <div className="todos-cursos-grid">
      {/* Sidebar lateral con buscador y filtros de categoría y nivel */}
      <SearchSidebar
        searchTerm={filters.searchTerm}
        onSearchChange={(v) => updateFilter("searchTerm", v)}
        searchPlaceholder="Buscar cursos..."
        filterGroups={filterGroups}
        activeFilters={{ category: filters.category, level: filters.level }}
        onFilterChange={updateFilter}
        onClearAll={() => setFilters({ category: "", level: "", searchTerm: "" })}
      />

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
