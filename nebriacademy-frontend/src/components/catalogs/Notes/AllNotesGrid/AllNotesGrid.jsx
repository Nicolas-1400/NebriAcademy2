// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../../config/api";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Mas from "../../../../assets/Iconos/mas.png";
import Lapiz from "../../../../assets/Iconos/lapiz.png";
import SalirEdicion from "../../../../assets/Iconos/lapiz-cancelar3.png";
import NoteCard from "../NoteCard/NoteCard";
import SearchSidebar from "../../../common/SearchSidebar/SearchSidebar";
import useAuthStore from "../../../../store/useAuthStore";
import useToastStore from "../../../../store/toastStore";
import useModalStore from "../../../../store/modalStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página principal de apuntes: listado global con filtros, likes y modo edición
function AllNotesGrid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: usuario, tipo } = useAuthStore();
  const { addToast } = useToastStore();
  const { showConfirm } = useModalStore();

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const [data, setData] = useState({
    apuntes: [],
    profesores: [],
    alumnos: [],
    categorias: [],
  });
  // IDs de apuntes a los que el usuario ha dado like
  const [likedIds, setLikedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado de los filtros: categoría, buscador de texto y modo de vista
  const [filters, setFilters] = useState({
    category: "",
    searchTerm: "",
    viewMode: "all",
  });
  // En modo edición se muestran los botones de editar/borrar en cada apunte propio
  const [editMode, setEditMode] = useState(false);
  const [searchParams] = useSearchParams();

  // Si se llega desde el slider con ?categoria=X, pre-seleccionamos ese filtro
  useEffect(() => {
    const categoriaParam = searchParams.get("categoria");
    if (categoriaParam) {
      setFilters((prev) => ({ ...prev, category: categoriaParam }));
    }
    // Solo al montar (primera vez que se resuelven los searchParams)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Al montar el componente, cargamos apuntes, profesores, alumnos y categorías en paralelo
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [
          respuestaApuntes,
          respuestaProfesores,
          respuestaAlumnos,
          respuestaCategorias,
        ] = await Promise.all([
          fetch(`${API_URL}/apuntes`).then((respuesta) => respuesta.json()),
          fetch(`${API_URL}/profesores`).then((respuesta) => respuesta.json()),
          fetch(`${API_URL}/alumnos`).then((respuesta) => respuesta.json()),
          fetch(`${API_URL}/apuntes/categorias`).then((respuesta) =>
            respuesta.json().catch(() => ({ categorias: [] })),
          ),
        ]);

        setData({
          apuntes: respuestaApuntes.Apuntes || [],
          profesores: respuestaProfesores.Profesores || [],
          alumnos: respuestaAlumnos.Alumnos || [],
          categorias: respuestaCategorias.categorias || [],
        });
      } catch (error) {
        console.error(error);
        setError("Error cargando apuntes.");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  // Cargamos los likes del alumno cuando el usuario esté disponible
  useEffect(() => {
    if (!usuario?.id) return;
    fetch(`${API_URL}/apuntesalumnos/likes?alumnoId=${usuario.id}`)
      .then((respuesta) => respuesta.json())
      .then((datos) => setLikedIds(datos.apunteIds || []))
      .catch(console.error);
  }, [usuario]);

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Resuelve el nombre del autor de un apunte buscando primero entre alumnos y luego entre profesores
  const resolveAutorNombre = (autorId) => {
    const aid = Number(autorId);
    const alum = data.alumnos.find((a) => Number(a.usuarioId) === aid);
    if (alum) return `${alum.nombre} ${alum.apellidos}`;
    const prof = data.profesores.find((p) => Number(p.usuarioId) === aid);
    if (prof) return `${prof.nombre} ${prof.apellidos}`;
    return "Desconocido";
  };

  // Comprueba si el usuario actual puede borrar el apunte: los admins pueden con cualquiera, el resto solo con los suyos
  const canEdit = (apunte) => {
    if (!usuario) return false;
    if (tipo === "administrador") return true;
    const currentUserId = usuario.usuarioId || usuario.id;
    return Number(currentUserId) === Number(apunte.autor);
  };

  // Lista de apuntes filtrada y ordenada según los criterios activos; se recalcula al cambiar datos o filtros
  const processedApuntes = useMemo(() => {
    let list = data.apuntes.filter((a) => {
      if (filters.category && a.categoria !== filters.category) return false;

      const term = filters.searchTerm.toLowerCase();
      if (term) {
        const matchName = (a.nombre || "").toLowerCase().includes(term);
        const matchAuth = resolveAutorNombre(a.autor)
          .toLowerCase()
          .includes(term);
        if (!matchName && !matchAuth) return false;
      }
      return true;
    });

    // Modos de vista especiales que filtran u ordenan la lista resultante
    if (filters.viewMode === "misApuntes" && usuario?.usuarioId) {
      list = list.filter((a) => Number(a.autor) === Number(usuario.usuarioId));
    } else if (filters.viewMode === "favoritos") {
      list = list.filter((a) => likedIds.includes(a.id));
    } else if (filters.viewMode === "popular") {
      list.sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
    } else if (filters.viewMode === "novedades") {
      list.sort((a, b) => b.id - a.id);
    }
    return list;
  }, [data, filters, usuario, likedIds]);

  // Alterna el like de un apunte (solo alumnos): actualiza backend y estado local
  const handleToggleLike = async (apunte) => {
    if (!usuario?.id || tipo !== "alumno") return;
    try {
      const res = await fetch(`${API_URL}/apuntesalumnos/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apunteId: apunte.id,
          alumnoId: usuario.id,
          vote: true,
        }),
      });
      const d = await res.json();
      if (res.ok) {
        const isLike = d.registro?.valoracion === true;
        setLikedIds((prev) =>
          isLike ? [...prev, apunte.id] : prev.filter((x) => x !== apunte.id),
        );
        // Actualizamos el contador de likes en la lista sin recargar la página
        setData((prev) => ({
          ...prev,
          apuntes: prev.apuntes.map((a) =>
            a.id === apunte.id ? { ...a, valoracion: d.apunte?.valoracion } : a,
          ),
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Borra un apunte con confirmación y lo elimina también del estado local
  const handleDelete = async (aid) => {
    const isUIAdmin = tipo === "administrador";
    const result = await showConfirm(
      "¿Borrar apunte?",
      "Borrar Apunte",
      { withInput: isUIAdmin }
    );
    if (result === false) return;
    
    try {
      let url = `${API_URL}/apuntes/${aid}`;
      if (isUIAdmin && typeof result === "string" && result.trim()) {
        url += `?reason=${encodeURIComponent(result)}`;
      }

      await fetch(url, { method: "DELETE" });
      setData((prev) => ({
        ...prev,
        apuntes: prev.apuntes.filter((a) => a.id !== aid),
      }));
      addToast("Apunte borrado", "success");
    } catch (e) {
      console.error(e);
      addToast("Error al borrar apunte", "error");
    }
  };


  // Actualiza un único campo de los filtros sin alterar los demás
  const updateFilter = (field, val) =>
    setFilters((prev) => ({ ...prev, [field]: val }));

  // ── Configuración del SearchSidebar ──────────────────────────────────────
  const viewModeOptions = [
    { label: "Todos", value: "all" },
    { label: "Mis apuntes", value: "misApuntes" },
    { label: "Populares", value: "popular" },
    { label: "Novedades", value: "novedades" },
    ...(tipo === "alumno" ? [{ label: "Favoritos", value: "favoritos" }] : []),
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
      label: "Filtrar",
      key: "viewMode",
      options: viewModeOptions,
    },
  ];

  if (error) return <p>{error}</p>;

  return (
    <div className="apuntes-grid">
      {/* Sidebar lateral con buscador, filtros de categoría, modos de vista y botón de limpiar */}
      <SearchSidebar
        searchTerm={filters.searchTerm}
        onSearchChange={(v) => updateFilter("searchTerm", v)}
        searchPlaceholder="Buscar..."
        filterGroups={filterGroups}
        activeFilters={{
          category: filters.category,
          viewMode: filters.viewMode,
        }}
        onFilterChange={updateFilter}
        onClearAll={() =>
          setFilters({ category: "", searchTerm: "", viewMode: "all" })
        }
      />

      {/* Grid principal con la lista de apuntes filtrados */}
      <main className="apuntes-contenedor">
        <h2>Apuntes</h2>
        <div className="apuntes-list-container">
          {loading ? (
            <p className="mensaje-cargando">Cargando apuntes...</p>
          ) : processedApuntes.length > 0 ? (
            <ul className="apuntes-list">
              {processedApuntes.map((ap) => (
                <li key={ap.id} className="apunte-item">
                  <NoteCard
                    apunte={ap}
                    usuario={usuario}
                    likedIds={likedIds}
                    onToggleLike={handleToggleLike}
                    autorNombre={resolveAutorNombre(ap.autor)}
                    isEditMode={editMode}
                  />
                  {/* Botones de editar/borrar visibles en modo edición si es autor, o siempre para admin */}
                  {(tipo === "administrador" || (editMode && canEdit(ap))) && (
                    <div className="apunte-edit-controls">
                      {tipo !== "administrador" && (
                        <button
                          onClick={() =>
                            navigate(`/Home/Notes/EditContent/${ap.id}`, {
                              state: { tipo: "apunte", item: ap },
                            })
                          }
                        >
                          Editar
                        </button>
                      )}
                      <button onClick={() => handleDelete(ap.id)}>
                        Borrar
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mensaje-vacio">No se han encontrado apuntes.</p>
          )}
        </div>
      </main>

      {/* Botones flotantes: activar modo edición y subir nuevo apunte (subir solo para no-admin) */}
      <div className="fixed-action-group">
        {tipo !== "administrador" && (
          <button
            className="editarApuntes"
            onClick={() => setEditMode(!editMode)}
            title={editMode ? "Salir edición" : "Editar"}
          >
            <img src={editMode ? SalirEdicion : Lapiz} alt="Editar" />
          </button>
        )}
        {tipo !== "administrador" && (
          <button
            className="subirContenidoCurso"
            onClick={() =>
              navigate("/Home/AddContent/individual", {
                state: { tipo: "apunte", cursoId: id || 0 },
              })
            }
            title="Subir"
          >
            <img src={Mas} alt="Subir" />
          </button>
        )}
      </div>
    </div>
  );
}

export default AllNotesGrid;
