// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../config/api";
import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import CardSlider from "./CardSlider";
import TarjetaCursos from "./TarjetaCursos";
import Eliminar from "../assets/Iconos/Eliminar.png";
import SliderComponent from "./SliderComponent";
import useToastStore from "../store/toastStore";
import useModalStore from "../store/modalStore";
import "../styles/HomeEspacio.css";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
function Home() {
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [cursosAlumnos, setCursosAlumnos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const storeUser = useAuthStore((state) => state.user);
  const tipoUsuario = useAuthStore((state) => state.tipo);

  // Identificación de roles
  const isEstudiante = tipoUsuario === "alumno";
  const isAdmin = tipoUsuario === "administrador";
  const isProfesor = tipoUsuario === "profesor";
  const { addToast } = useToastStore();
  const { showConfirm } = useModalStore();

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Sincronizar usuario del store
  useEffect(() => {
    if (storeUser) setUsuario(storeUser);
  }, [storeUser]);

  // Cargar datos al montar el componente
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const datosCursos = await fetch(`${API_URL}/cursos`).then((r) =>
          r.json(),
        );
        setCursos(datosCursos.Cursos || []);

        // Tanto alumnos como administradores necesitan categorías y (opcionalmente) cursos matriculados
        if (isEstudiante || isAdmin) {
          if (isEstudiante) {
            const datosCursosAlumnos = await fetch(
              `${API_URL}/cursosalumnos`,
            ).then((r) => r.json());
            setCursosAlumnos(datosCursosAlumnos.CursosAlumnos || []);
          }

          const datosCategorias = await fetch(`${API_URL}/cursos/categorias`)
            .then((r) => r.json())
            .catch(() => ({ categorias: [] }));
          setCategorias(
            Array.isArray(datosCategorias.categorias)
              ? datosCategorias.categorias
              : [],
          );
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("Error al cargar el contenido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEstudiante, isAdmin]);

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Filtrar cursos para alumnos vinculados
  const filtrarCursosVinculado = (lista) => {
    if (!storeUser?.esVinculado || !storeUser?.profesorVinculadoId)
      return lista;
    return lista.filter((c) => c.profesor !== storeUser.profesorVinculadoId);
  };

  // [ALUMNO] Filtrar cursos en los que está apuntado
  const tusCursos = () => {
    if (!usuario) return [];
    const lista = cursosAlumnos
      .filter((ca) => ca.alumnoId === usuario.id && ca.apuntado)
      .map((ca) => cursos.find((c) => c.id === ca.cursoId))
      .filter((c) => c)
      .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
    return filtrarCursosVinculado(lista);
  };

  // [ALUMNO/ADMIN] Ordenar por ID descendente (novedades)
  const novedades = () => {
    return filtrarCursosVinculado(cursos.slice().sort((a, b) => b.id - a.id));
  };

  // [ALUMNO/ADMIN] Ordenar por valoración (populares)
  const cursosPopulares = () => {
    return filtrarCursosVinculado(
      cursos.slice().sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0)),
    );
  };

  // [PROFESOR] Filtrar cursos del profesor
  const misCursos = () => {
    return cursos.filter((c) => c.profesor === usuario?.id) || [];
  };

  // Navegar a cursos con filtro por categoría
  const handleCategoryClick = (categoria) => {
    navigate(`/Home/Cursos`, { state: { selectedCategory: categoria } });
  };

  // Eliminar curso (profesor)
  const handleDeleteCurso = async (cursoId, e) => {
    e.stopPropagation();
    const confirmed = await showConfirm(
      "¿Estás seguro de que quieres borrar este curso? Se eliminará TODO su contenido (vídeos, apuntes, ejercicios...) y NO se podrá recuperar.",
      "Eliminar Curso"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/cursos/${cursoId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCursos((prev) => prev.filter((c) => c.id !== cursoId));
        addToast("Curso eliminado con éxito", "success");
      } else {
        addToast("Error al eliminar el curso", "error");
      }
    } catch (error) {
      console.error(error);
      addToast("Error de conexión", "error");
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-container">
        <p>Cargando contenido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header-container">
        <h1>
          Bienvenido/a:{" "}
          {usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Usuario"}
        </h1>
        {/* Botón de eliminar solo para profesores */}
        {isProfesor && (
          <button
            onClick={() => setIsDeleting(!isDeleting)}
            className="btn-delete-mode"
            title="Borrar cursos"
          >
            <img
              src={Eliminar}
              alt="Papelera"
              className={`icon-delete-mode ${isDeleting ? "active" : "inactive"}`}
            />
          </button>
        )}
      </div>

      {/* VISTA ALUMNO / ADMINISTRADOR */}
      {isEstudiante || isAdmin ? (
        <div className="page-sections">
          {/* Sección Novedades */}
          <div className="section-carousel">
            <h2>Novedades</h2>
            <SliderComponent>
              {novedades().length > 0 ? (
                novedades().map((curso) => (
                  <CardSlider
                    key={curso.id}
                    name={curso.nombreCurso}
                    cursoId={curso.id}
                    nivel={curso.nivel}
                    valoracion={curso.valoracion || 0}
                    imagen={curso.imagen}
                  />
                ))
              ) : (
                <p className="mensaje-vacio">No hay cursos disponibles</p>
              )}
            </SliderComponent>
          </div>

          {/* Sección Tus cursos (Solo para Alumnos) */}
          {isEstudiante && (
            <div className="section-carousel">
              <h2>Tus cursos</h2>
              <SliderComponent>
                {tusCursos().length > 0 ? (
                  tusCursos().map((curso) => (
                    <CardSlider
                      key={curso.id}
                      name={curso.nombreCurso}
                      cursoId={curso.id}
                      nivel={curso.nivel}
                      valoracion={curso.valoracion || 0}
                      imagen={curso.imagen}
                    />
                  ))
                ) : (
                  <p className="mensaje-vacio">
                    No estás apuntado a ningún curso aún
                  </p>
                )}
              </SliderComponent>
            </div>
          )}

          {/* Sección Categorías */}
          <div className="section-categories">
            <h2>Categorías</h2>
            <div className="category-buttons">
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  className="category-btn"
                  onClick={() => handleCategoryClick(categoria)}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>

          {/* Sección Cursos populares */}
          <div className="section-carousel">
            <h2>Cursos populares</h2>
            <SliderComponent>
              {cursosPopulares().length > 0 ? (
                cursosPopulares().map((curso) => (
                  <CardSlider
                    key={curso.id}
                    name={curso.nombreCurso}
                    cursoId={curso.id}
                    nivel={curso.nivel}
                    valoracion={curso.valoracion || 0}
                    imagen={curso.imagen}
                  />
                ))
              ) : (
                <p className="mensaje-vacio">No hay cursos disponibles</p>
              )}
            </SliderComponent>
          </div>
        </div>
      ) : (
        /* VISTA PROFESOR */
        <div className="page-grid-professor">
          <h2>Tus cursos</h2>
          <div className="grid-courses">
            {misCursos().length === 0 ? (
              <p className="message-empty">
                No tienes cursos asignados todavía.
              </p>
            ) : (
              misCursos().map((c) => (
                <TarjetaCursos
                  key={c.id}
                  name={c.nombreCurso}
                  cursoId={c.id}
                  categoria={c.categoria}
                  nivel={c.nivel}
                  descripcion={c.descripcion}
                  profesor={
                    usuario ? `${usuario.nombre} ${usuario.apellidos}` : ""
                  }
                  valoracion={c.valoracion}
                  imagen={c.imagen}
                  isDeleting={isDeleting}
                  onDelete={(e) => handleDeleteCurso(c.id, e)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}


export default Home;

