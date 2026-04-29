// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../config/api";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Mas from "../assets/Iconos/mas.png";
import Lapiz from "../assets/Iconos/lapiz.png";
import SalirEdicion from "../assets/Iconos/lapiz-cancelar3.png";
import TarjetaApunte from "./TarjetaApunte";
import useAuthStore from "../store/useAuthStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página principal de apuntes: listado global con filtros, likes y modo edición
function ApuntesGrid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: usuario, tipo } = useAuthStore();

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const [data, setData] = useState({
    apuntes: [],
    profesores: [],
    alumnos: [],
    categorias: [],
  });
  // IDs de apuntes a los que el usuario ha dado like
  const [likedIds, setLikedIds] = useState([]);
  const [error, setError] = useState(null);

  // Estado de los filtros: categoría, buscador de texto y modo de vista
  const [filters, setFilters] = useState({
    category: "",
    searchTerm: "",
    viewMode: "all",
  });
  // En modo edición se muestran los botones de editar/borrar en cada apunte propio
  const [editMode, setEditMode] = useState(false);

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
          fetch(`${API_URL}/apuntes`).then((respuesta) =>
            respuesta.json(),
          ),
          fetch(`${API_URL}/profesores`).then((respuesta) =>
            respuesta.json(),
          ),
          fetch(`${API_URL}/alumnos`).then((respuesta) =>
            respuesta.json(),
          ),
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
    const alum = data.alumnos.find(
      (a) => Number(a.usuarioId) === aid,
    );
    if (alum) return `${alum.nombre} ${alum.apellidos}`;
    const prof = data.profesores.find(
      (p) => Number(p.usuarioId) === aid,
    );
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
    if (!window.confirm("¿Borrar apunte?")) return;
    try {
      await fetch(`${API_URL}/apuntes/${aid}`, { method: "DELETE" });
      setData((prev) => ({
        ...prev,
        apuntes: prev.apuntes.filter((a) => a.id !== aid),
      }));
    } catch (e) {
      console.error(e);
    }
  };

  // Actualiza un único campo de los filtros sin alterar los demás
  const updateFilter = (field, val) =>
    setFilters((prev) => ({ ...prev, [field]: val }));

  if (error) return <p>{error}</p>;

  return (
    <div className="apuntes-grid">
      {/* Sidebar lateral con buscador, filtros de categoría, modos de vista y botón de limpiar */}
      <aside className="buscador-sidebar-apuntes">
        <div className="formulario-busqueda">
          <input
            type="search"
            placeholder="Buscar..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
          />
        </div>

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
          <hr className="separador-sidebar" />
          <ul>
            <li>
              <button
                onClick={() => updateFilter("viewMode", "misApuntes")}
                className={filters.viewMode === "misApuntes" ? "activo" : ""}
              >
                Mis apuntes
              </button>
            </li>
            <li>
              <button
                onClick={() => updateFilter("viewMode", "popular")}
                className={filters.viewMode === "popular" ? "activo" : ""}
              >
                Populares
              </button>
            </li>
            <li>
              <button
                onClick={() => updateFilter("viewMode", "novedades")}
                className={filters.viewMode === "novedades" ? "activo" : ""}
              >
                Novedades
              </button>
            </li>
            {/* El modo "Favoritos" solo está disponible para alumnos */}
            {tipo === "alumno" && (
              <li>
                <button
                  onClick={() => updateFilter("viewMode", "favoritos")}
                  className={filters.viewMode === "favoritos" ? "activo" : ""}
                >
                  Favoritos
                </button>
              </li>
            )}
          </ul>
          <hr className="separador-sidebar" />
          <div className="limpiar-filtros">
            <button
              onClick={() =>
                setFilters({ category: "", searchTerm: "", viewMode: "all" })
              }
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </aside>

      {/* Grid principal con la lista de apuntes filtrados */}
      <main className="apuntes-contenedor">
        <h2>Apuntes</h2>
        <div className="apuntes-list-container">
          {processedApuntes.length > 0 ? (
            <ul className="apuntes-list">
              {processedApuntes.map((ap) => (
                <li key={ap.id} className="apunte-item">
                  <TarjetaApunte
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
                            navigate(`/Home/Apuntes/EditarApunte/${ap.id}`, {
                              state: { apunte: ap },
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
            <p className="no-apuntes">No se encontraron apuntes.</p>
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
              navigate("/Home/AddContenido/individual", {
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

export default ApuntesGrid;
