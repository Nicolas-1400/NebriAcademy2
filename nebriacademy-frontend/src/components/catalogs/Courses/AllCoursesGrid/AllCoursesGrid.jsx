// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../../config/api";
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import CourseCard from "../CourseCard/CourseCard";
import SearchSidebar from "../../../common/SearchSidebar/SearchSidebar";
import useAuthStore from "../../../../store/useAuthStore";
import DeleteIcon from "../../../../assets/Icons/delete.png";
import useToastStore from "../../../../store/toastStore";
import useModalStore from "../../../../store/modalStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Listado de todos los cursos con filtros por categoría, nivel y buscador de texto
function AllCoursesGrid() {
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
    enrollments: [], // Relación alumno-curso (favoritos, apuntados)
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado de los filtros: categoría, nivel, buscador y modo de vista
  const [filters, setFilters] = useState({
    category: state?.selectedCategory || "",
    level: "",
    searchTerm: "",
    viewMode: "all", // "all", "popular", "novedades", "favoritos", "apuntados"
  });

  const NIVELES = ["Básico", "Intermedio", "Avanzado"];

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Al montar el componente, cargamos cursos, profesores y categorías en paralelo
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const fetchPromises = [
          fetch(`${API_URL}/cursos`).then((r) => r.json()),
          fetch(`${API_URL}/profesores`).then((r) => r.json()),
          fetch(`${API_URL}/cursos/categorias`).then((r) =>
            r.json().catch(() => ({ categorias: [] })),
          ),
        ];

        // Solo cargamos enrolamientos si hay un alumno logueado
        if (tipo === "alumno" && user?.id) {
          fetchPromises.push(
            fetch(`${API_URL}/cursosalumnos`).then((r) => r.json()),
          );
        }

        const [
          respuestaCursos,
          respuestaProfesores,
          respuestaCategorias,
          respuestaEnroll,
        ] = await Promise.all(fetchPromises);

        setData({
          cursos: respuestaCursos.Cursos || [],
          profesores: respuestaProfesores.Profesores || [],
          categorias: respuestaCategorias.categorias || [],
          enrollments: respuestaEnroll?.CursosAlumnos || [],
        });
      } catch (error) {
        console.error(error);
        setError("Error al cargar los cursos");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [user, tipo]);

  // Busca el nombre del profesor a partir del ID del curso para mostrarlo en la tarjeta
  const getProfesorName = (pid) => {
    const p = data.profesores.find((prof) => prof.id === pid);
    return p ? `Profesor: ${p.nombre} ${p.apellidos}` : "Profesor: Desconocido";
  };

  // Elimina un curso completo con confirmación (solo admin)
  const handleDeleteCurso = async (cursoId) => {
    const reason = await showConfirm(
      "¿Eliminar este curso y todo su contenido? Esta acción no se puede deshacer.",
      "Eliminar Curso",
      { withInput: true },
    );
    if (reason === false) return; // Cancelado

    try {
      const url =
        reason && typeof reason === "string"
          ? `${API_URL}/cursos/${cursoId}?reason=${encodeURIComponent(reason)}`
          : `${API_URL}/cursos/${cursoId}`;

      const res = await fetch(url, {
        method: "DELETE",
      });
      if (res.ok) {
        setData((prev) => ({
          ...prev,
          cursos: prev.cursos.filter((c) => c.id !== cursoId),
        }));
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
    let list = [...data.cursos];

    // Aplicamos filtros de vista (favoritos, apuntados, populares, novedades)
    if (filters.viewMode === "favoritos" && user?.id) {
      const favIds = data.enrollments
        .filter((e) => e.alumnoId === user.id && e.favorito)
        .map((e) => e.cursoId);
      list = list.filter((c) => favIds.includes(c.id));
    } else if (filters.viewMode === "apuntados" && user?.id) {
      const enrolledIds = data.enrollments
        .filter((e) => e.alumnoId === user.id && e.apuntado)
        .map((e) => e.cursoId);
      list = list.filter((c) => enrolledIds.includes(c.id));
    } else if (filters.viewMode === "popular") {
      list.sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
    } else if (filters.viewMode === "novedades") {
      list.sort((a, b) => b.id - a.id);
    }

    // Aplicamos filtros básicos (categoría, nivel, búsqueda)
    return list.filter((c) => {
      // Los profesores solo ven sus propios cursos si se activa algún filtro (opcional, mantener lógica actual)
      if (
        tipo === "profesor" &&
        !data.cursos.some((cur) => cur.profesor === user.id)
      ) {
        // En este proyecto parece que los profesores ven todo el catálogo
      }

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
  }, [data, filters, user, tipo]);

  // ── Configuración del SearchSidebar ──────────────────────────────────────
  const viewModeOptions = [
    { label: "Todos", value: "all" },
    { label: "Populares", value: "popular" },
    { label: "Novedades", value: "novedades" },
    ...(tipo === "alumno"
      ? [
          { label: "Favoritos", value: "favoritos" },
          { label: "Apuntados", value: "apuntados" },
        ]
      : []),
  ];

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
    {
      label: "Ver",
      key: "viewMode",
      options: viewModeOptions,
    },
  ];

  if (error) return <p>{error}</p>;

  return (
    <div className="all-courses-grid">
      {/* Sidebar lateral con buscador y filtros de categoría y nivel */}
      <SearchSidebar
        searchTerm={filters.searchTerm}
        onSearchChange={(v) => updateFilter("searchTerm", v)}
        searchPlaceholder="Buscar cursos..."
        filterGroups={filterGroups}
        activeFilters={{
          category: filters.category,
          level: filters.level,
          viewMode: filters.viewMode,
        }}
        onFilterChange={updateFilter}
        onClearAll={() =>
          setFilters({
            category: "",
            level: "",
            searchTerm: "",
            viewMode: "all",
          })
        }
      />

      {/* Grid principal con las tarjetas de los cursos filtrados */}
      <main className="courses-container">
        <h2>Cursos</h2>
        {loading ? (
          <p className="loading-message">Cargando cursos...</p>
        ) : filteredCursos.length > 0 ? (
          <div className="courses-grid">
            {filteredCursos.map((c) => (
              <div key={c.id} className="course-card-wrapper">
                <CourseCard
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
        ) : (
          <p className="empty-message">No se han encontrado cursos.</p>
        )}
      </main>
    </div>
  );
}

export default AllCoursesGrid;
