// ==========================================
// 1. IMPORTACIONES
// ==========================================
// Integración de hooks de React fundamentales
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
// Imágenes e Íconos decorativos o funcionales
import Mas from "../assets/mas.png";
import Lapiz from "../assets/lapiz.png";
import SalirEdicion from "../assets/lapiz-cancelar3.png";
// Componentes dependientes
import TarjetaApunte from "./TarjetaApunte";
// Almacenamiento central del entorno de autenticación (Zustand)
import useAuthStore from "../store/useAuthStore";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// ApuntesGrid: Renderiza la biblioteca global de apuntes mostrando tarjetas.
// Contiene una barra lateral para aplicar filtros por búsqueda, categoría y modo de vista
// Además permite la edición o borrado si el elemento pertenece al usuario actual.
function ApuntesGrid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: usuario, tipo } = useAuthStore();

  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================

  const [data, setData] = useState({
    apuntes: [], // Todos los apuntes registrados en la plataforma
    profesores: [], // Listado de profesores para resolver autorías
    alumnos: [], // Listado de alumnos para resolver autorías
    categorias: [], // Categorías dinámicas disponibles en los apuntes
  });

  // Arreglo de Ids de los apuntes a los que el usuario actual ha dado 'like'
  const [likedIds, setLikedIds] = useState([]);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    category: "", // Categoría activa seleccionada
    searchTerm: "", // Texto ingresado en la barra de búsqueda
    viewMode: "all", // Modo de visualización (todos, favoritos, novedades, misApuntes)
  });

  // Bandera para activar la interfaz de edición de tarjetas en pantalla
  const [editMode, setEditMode] = useState(false);

  // ==========================================
  // 4. EFECTOS
  // ==========================================

  // Carga paralela de todas las entidades base necesarias al renderizar por primera vez.
  // Optimiza tiempos de espera en lugar de hacer 'await' por cada fetch secuencial.
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [
          respuestaApuntes,
          respuestaProfesores,
          respuestaAlumnos,
          respuestaCategorias,
        ] = await Promise.all([
          fetch("http://localhost:3000/apuntes").then((res) => res.json()),
          fetch("http://localhost:3000/profesores").then((res) => res.json()),
          fetch("http://localhost:3000/alumnos").then((res) => res.json()),
          fetch("http://localhost:3000/apuntes/categorias").then((res) =>
            res.json().catch(() => ({ categorias: [] })),
          ),
        ]);

        setData({
          apuntes: respuestaApuntes.Apuntes || [],
          profesores: respuestaProfesores.Profesores || [],
          alumnos: respuestaAlumnos.Alumnos || [],
          categorias: respuestaCategorias.categorias || [],
        });
      } catch (error) {
        console.error("Error al efectuar carga inicial de apuntes", error);
        setError("Error cargando la lista de apuntes.");
      }
    };
    cargarDatos();
  }, []);

  // Depende de la identidad del usuario logueado en la sesión
  // Trae de base de datos aquellos apuntes que el alumno ha marcado como favoritos
  useEffect(() => {
    if (!usuario?.id) return;

    fetch(`http://localhost:3000/apuntesalumnos/likes?alumnoId=${usuario.id}`)
      .then((respuesta) => respuesta.json())
      .then((datos) => setLikedIds(datos.apunteIds || []))
      .catch(console.error);
  }, [usuario]);

  // ==========================================
  // 5. VARIABLES, CÁLCULOS Y HELPERS
  // ==========================================

  // Resuelve dinámicamente el nombre real y legible de un autor a partir de un ID genérico,
  // buscando entre la lista local de profesores y alumnos.
  const resolveAutorNombre = (autorId) => {
    const aid = Number(autorId);

    // Prioriza buscar en la lista de alumnos
    const alum = data.alumnos.find(
      (a) => Number(a.usuarioId) === aid || Number(a.id) === aid,
    );
    if (alum) return `${alum.nombre} ${alum.apellidos}`;

    // Si no está en alumnos, busca en la lista de profesores
    const prof = data.profesores.find(
      (p) => Number(p.usuarioId) === aid || Number(p.id) === aid,
    );
    if (prof) return `${prof.nombre} ${prof.apellidos}`;

    return "Desconocido";
  };

  // Determina si el usuario logueado en la sesión activa es el creador de un apunte para habilitar acciones.
  const canEdit = (apunte) => {
    if (!usuario) return false;
    const currentUserId = usuario.usuarioId || usuario.id;
    return Number(currentUserId) === Number(apunte.autor);
  };

  // Derivación de estado clave mediante "useMemo"
  // Solo se recalcula cuando cambian los apuntes originales, los filtros o los likes del usuario.
  // Aplica de forma encadenada los filtros y ordenamientos seleccionados en la UI.
  const processedApuntes = useMemo(() => {
    let list = data.apuntes.filter((a) => {
      // 1. Validar filtro de Categoría si hay alguno activo
      if (filters.category && a.categoria !== filters.category) return false;

      // 2. Validar filtro por cadena de texto (búsqueda en título o nombre del autor)
      const term = filters.searchTerm.toLowerCase();
      if (term) {
        const matchName = (a.nombre || "").toLowerCase().includes(term);
        const matchAuth = resolveAutorNombre(a.autor)
          .toLowerCase()
          .includes(term);
        // Desecha el elemento si no coincide con ninguna condición
        if (!matchName && !matchAuth) return false;
      }
      return true; // Pasa el corte de filtros
    });

    // 3. Aplica la estrategia de ordenamiento/reducción asignada a la vista actual
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

  // Actualiza mutando específicamente una clave dentro de la caja de filtros
  const updateFilter = (field, val) =>
    setFilters((prev) => ({ ...prev, [field]: val }));

  // ==========================================
  // 6. FUNCIONES Y MANEJADORES DE EVENTOS
  // ==========================================

  // Petición al servidor para alternar (activar/desactivar) un "like" hacia un apunte específico
  // Registra el voto en el backend y luego actualiza optimístamente los estados locales.
  const handleToggleLike = async (apunte) => {
    // Restricciones de negocio: Solo los alumnos pueden guardar/likear apuntes globalmente
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
        // Analiza la respuesta para saber la nueva situación del feedback
        const isLike = d.registro?.valoracion === true;
        // Incurre el cambio en la memoria para sincronizar el estilo de la tarjeta (corazón rojo/blanco)
        setLikedIds((prev) =>
          isLike ? [...prev, apunte.id] : prev.filter((x) => x !== apunte.id),
        );
        // Actualiza el contador global que refleja la valoración del apunte
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

  // Maneja la petición de borrado definitivo de un apunte por parte del propietario
  const handleDelete = async (aid) => {
    // Barrera de confirmación visual para evitar percances
    if (
      !window.confirm(
        "¿Seguro que deseas descartar este apunte? No podrás deshacer la acción.",
      )
    )
      return;

    try {
      await fetch(`http://localhost:3000/apuntes/${aid}`, { method: "DELETE" });

      // Expulsa visualmente el apunte de las listas de forma local
      setData((prev) => ({
        ...prev,
        apuntes: prev.apuntes.filter((a) => a.id !== aid),
      }));
    } catch (e) {
      console.error(e);
    }
  };

  // ==========================================
  // 7. BLOQUE DE RENDERIZADO
  // ==========================================

  if (error) return <p className="error-general">{error}</p>;

  return (
    <div className="apuntes-grid">
      {/* ===== SIDEBAR DE GESTIÓN DE FILTROS ===== */}
      <aside className="buscador-sidebar-apuntes">
        <div className="formulario-busqueda">
          <input
            type="search"
            placeholder="Buscar apuntes o autores..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
          />
        </div>

        <div className="categorias-sidebar">
          <h3>Filtrar Pors</h3>

          {/* Listado dinámico de las categorías de la plataforma */}
          <ul>
            <li>
              <button
                onClick={() => updateFilter("category", "")}
                className={!filters.category ? "activo" : ""}
              >
                Todas las disciplinas
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

          {/* Clasificadores y agrupaciones extra de contenido */}
          <ul>
            <li>
              <button
                onClick={() => updateFilter("viewMode", "misApuntes")}
                className={filters.viewMode === "misApuntes" ? "activo" : ""}
              >
                Mis aportaciones
              </button>
            </li>
            <li>
              <button
                onClick={() => updateFilter("viewMode", "popular")}
                className={filters.viewMode === "popular" ? "activo" : ""}
              >
                Los más valorados
              </button>
            </li>
            <li>
              <button
                onClick={() => updateFilter("viewMode", "novedades")}
                className={filters.viewMode === "novedades" ? "activo" : ""}
              >
                Recién subidos
              </button>
            </li>

            {/* Solo los alumnos pueden ver la pestaña de favoritos, el negocio dictamina */}
            {tipo === "alumno" && (
              <li>
                <button
                  onClick={() => updateFilter("viewMode", "favoritos")}
                  className={filters.viewMode === "favoritos" ? "activo" : ""}
                >
                  Documentos guardados
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
              Restablecer parámetros
            </button>
          </div>
        </div>
      </aside>

      {/* ===== CONTENEDOR PRINCIPAL DE RESULTADOS ===== */}
      <main className="apuntes-contenedor">
        <h2>Apuntes de la Comunidad</h2>

        <div className="apuntes-list-container">
          {processedApuntes.length > 0 ? (
            <ul className="apuntes-list">
              {processedApuntes.map((ap) => (
                <li key={ap.id} className="apunte-item">
                  {/* Tarjeta aislada que engloba UI de cada elemento */}
                  <TarjetaApunte
                    apunte={ap}
                    usuario={usuario}
                    likedIds={likedIds}
                    onToggleLike={handleToggleLike}
                    autorNombre={resolveAutorNombre(ap.autor)}
                    isEditMode={editMode}
                  />

                  {/* Interfaz de manipulación expuesta solo si está la bandera activa de edición para ese usuario */}
                  {editMode && canEdit(ap) && (
                    <div className="apunte-edit-controls">
                      <button
                        onClick={() =>
                          navigate(`/Home/Apuntes/EditarApunte/${ap.id}`, {
                            state: { apunte: ap },
                          })
                        }
                      >
                        Renombrar / Modificar
                      </button>
                      <button onClick={() => handleDelete(ap.id)}>
                        Eliminar material
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-apuntes">
              No se han encontrado resultados en nuestra base de datos con los
              criterios seleccionados.
            </p>
          )}
        </div>
      </main>

      {/* ===== BOTONES FLOTANTES DE ACCIÓN GLOBAL ===== */}
      <div className="fixed-action-group">
        <button
          className="editarApuntes"
          onClick={() => setEditMode(!editMode)}
          title={editMode ? "Salir del modo gestión" : "Gestionar mis ficheros"}
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
          title="Publicar nuevo contenido"
        >
          <img src={Mas} alt="Subir" />
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 8. EXPORTACIONES MÓDULO
// ==========================================
export default ApuntesGrid;
