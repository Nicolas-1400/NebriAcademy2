import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Mas from "../assets/mas.png";
import Lapiz from "../assets/lapiz.png";
import SalirEdicion from "../assets/lapiz-cancelar3.png";
import TarjetaApunte from "./TarjetaApunte";
import useAuthStore from "../store/useAuthStore";

/**
 * Componente: ApuntesGrid
 * Catálogo de apuntes con búsquedas, filtros por categoría y vistas (populares, novedades, mis apuntes).
 */
function ApuntesGrid() {
  const { id } = useParams(); // id curso opcional
  const navigate = useNavigate();
  const { user: usuario, tipo } = useAuthStore();

  // Datos
  const [data, setData] = useState({
    apuntes: [],
    profesores: [],
    alumnos: [],
    categorias: [],
  });
  const [likedIds, setLikedIds] = useState([]);
  const [error, setError] = useState(null);

  // Filtros UI
  const [filters, setFilters] = useState({
    category: "",
    searchTerm: "",
    viewMode: "all",
  });
  const [editMode, setEditMode] = useState(false);

  // --- Carga de Datos ---
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [
          respuestaApuntes,
          respuestaProfesores,
          respuestaAlumnos,
          respuestaCategorias,
        ] = await Promise.all([
          fetch("http://localhost:3000/apuntes").then((respuesta) =>
            respuesta.json(),
          ),
          fetch("http://localhost:3000/profesores").then((respuesta) =>
            respuesta.json(),
          ),
          fetch("http://localhost:3000/alumnos").then((respuesta) =>
            respuesta.json(),
          ),
          fetch("http://localhost:3000/apuntes/categorias").then((respuesta) =>
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

  // Carga Likes
  useEffect(() => {
    if (!usuario?.id) return;
    fetch(`http://localhost:3000/apuntesalumnos/likes?alumnoId=${usuario.id}`)
      .then((respuesta) => respuesta.json())
      .then((datos) => setLikedIds(datos.apunteIds || []))
      .catch(console.error);
  }, [usuario]);

  // --- Lógica de Procesamiento y Filtrado ---

  // Función para averiguar el nombre del autor, buscando tanto en la lista de alumnos como en la de profesores.
  const resolveAutorNombre = (autorId) => {
    const aid = Number(autorId);
    const alum = data.alumnos.find(
      (a) => Number(a.usuarioId) === aid || Number(a.id) === aid,
    );
    if (alum) return `${alum.nombre} ${alum.apellidos}`;
    const prof = data.profesores.find(
      (p) => Number(p.usuarioId) === aid || Number(p.id) === aid,
    );
    if (prof) return `${prof.nombre} ${prof.apellidos}`;
    return "Desconocido";
  };

  const canEdit = (apunte) => {
    if (!usuario) return false;
    const currentUserId = usuario.usuarioId || usuario.id;
    return Number(currentUserId) === Number(apunte.autor);
  };

  // Filtrado de apuntes.
  // Aplica los filtros seleccionados por el usuario (Categoría, Texto) y el modo de vista (Mis apuntes, Populares...).
  const processedApuntes = useMemo(() => {
    let list = data.apuntes.filter((a) => {
      // 1. Filtro por Categoría
      if (filters.category && a.categoria !== filters.category) return false;

      // 2. Filtro de Texto (Busca en el nombre del apunte y en el nombre del autor)
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

    // 3. Ordenamiento según lo que quiera ver el usuario
    if (filters.viewMode === "misApuntes" && usuario?.usuarioId) {
      list = list.filter((a) => Number(a.autor) === Number(usuario.usuarioId));
    } else if (filters.viewMode === "favoritos") {
      list = list.filter((a) => likedIds.includes(a.id));
    } else if (filters.viewMode === "popular") {
      list.sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
    } else if (filters.viewMode === "novedades") {
      list.sort((a, b) => b.id - a.id); // Ordenamos del más nuevo al más antiguo
    }
    return list;
  }, [data, filters, usuario, likedIds]);

  // --- Handlers ---
  const handleToggleLike = async (apunte) => {
    if (!usuario?.id || tipo !== "alumno") return;
    try {
      const res = await fetch("http://localhost:3000/apuntesalumnos/vote", {
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

  const handleDelete = async (aid) => {
    if (!window.confirm("¿Borrar apunte?")) return;
    try {
      await fetch(`http://localhost:3000/apuntes/${aid}`, { method: "DELETE" });
      setData((prev) => ({
        ...prev,
        apuntes: prev.apuntes.filter((a) => a.id !== aid),
      }));
    } catch (e) {
      console.error(e);
    }
  };

  // --- Render Helpers ---
  const updateFilter = (field, val) =>
    setFilters((prev) => ({ ...prev, [field]: val }));

  if (error) return <p>{error}</p>;

  return (
    <div className="apuntes-grid">
      {/* SIDEBAR FILTROS */}
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

      {/* LISTA PRINCIPAL */}
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
                  {editMode && canEdit(ap) && (
                    <div className="apunte-edit-controls">
                      <button
                        onClick={() =>
                          navigate(`/Home/Apuntes/EditarApunte/${ap.id}`, {
                            state: { apunte: ap },
                          })
                        }
                      >
                        Editar
                      </button>
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

      {/* ACTIVE BUTTONS */}
      <div className="fixed-action-group">
        <button
          className="editarApuntes"
          onClick={() => setEditMode(!editMode)}
          title={editMode ? "Salir edición" : "Editar"}
        >
          <img src={editMode ? SalirEdicion : Lapiz} alt="Editar" />
        </button>
        <button
          className="subirContenidoCurso"
          onClick={() =>
            navigate("/Home/Apuntes/AddApunte", {
              state: { tipo: "apunte", cursoId: id || 0 },
            })
          }
          title="Subir"
        >
          <img src={Mas} alt="Subir" />
        </button>
      </div>
    </div>
  );
}

export default ApuntesGrid;
