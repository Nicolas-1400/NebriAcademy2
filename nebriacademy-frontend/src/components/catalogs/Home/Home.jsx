// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../config/api";
import { useEffect, useState } from "react";
import useAuthStore from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import CardSlider from "../../common/Sliders/CardSlider";
import CourseCard from "../Courses/CourseCard/CourseCard";
import DeleteIcon from "../../../assets/Icons/delete.png";
import SliderComponent from "../../common/Sliders/SliderComponent";
import useToastStore from "../../../store/toastStore";
import useModalStore from "../../../store/modalStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Componente principal de la vista de inicio (Dashboard)
function Home() {
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // Estado local para almacenar datos recuperados del backend
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [cursosAlumnos, setCursosAlumnos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  
  // Estado para controlar la pantalla de carga y el modo de borrado de cursos
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  // Extracción de datos del estado global Zustand
  const storeUser = useAuthStore((state) => state.user);
  const tipoUsuario = useAuthStore((state) => state.tipo);

  // Banderas booleanas para facilitar la verificación de roles
  const isEstudiante = tipoUsuario === "alumno";
  const isAdmin = tipoUsuario === "administrador";
  const isProfesor = tipoUsuario === "profesor";
  
  const { addToast } = useToastStore();
  const { showConfirm } = useModalStore();

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Mantiene sincronizado el estado local de usuario con el store global
  useEffect(() => {
    if (storeUser) setUsuario(storeUser);
  }, [storeUser]);

  // Carga inicial de datos desde la base de datos al montar el componente
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        // Obtenemos todos los cursos disponibles
        const datosCursos = await fetch(`${API_URL}/cursos`).then((r) => r.json());
        setCursos(datosCursos.Cursos || []);

        // Carga de datos específicos para alumnos y administradores
        if (isEstudiante || isAdmin) {
          if (isEstudiante) {
            // Obtenemos las inscripciones del alumno para la sección "Tus cursos"
            const datosCursosAlumnos = await fetch(`${API_URL}/cursosalumnos`).then((r) => r.json());
            setCursosAlumnos(datosCursosAlumnos.CursosAlumnos || []);
          }

          // Obtenemos las categorías para generar los botones de filtro
          const datosCategorias = await fetch(`${API_URL}/cursos/categorias`)
            .then((r) => r.json())
            .catch(() => ({ categorias: [] }));
          setCategorias(Array.isArray(datosCategorias.categorias) ? datosCategorias.categorias : []);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("Error al cargar el contenido");
      } finally {
        setLoading(false); // Desactiva la pantalla de carga independientemente del resultado
      }
    };

    fetchData();
  }, [isEstudiante, isAdmin]);

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Filtra cursos creados por el profesor vinculado para que el alumno no pueda interactuar con ellos
  const filtrarCursosVinculado = (lista) => {
    if (!storeUser?.esVinculado || !storeUser?.profesorVinculadoId) return lista;
    return lista.filter((c) => c.profesor !== storeUser.profesorVinculadoId);
  };

  // Obtiene los cursos en los que el alumno está inscrito y los ordena por valoración
  const tusCursos = () => {
    if (!usuario) return [];
    const lista = cursosAlumnos
      .filter((ca) => ca.alumnoId === usuario.id && ca.apuntado)
      .map((ca) => cursos.find((c) => c.id === ca.cursoId))
      .filter((c) => c)
      .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
    return filtrarCursosVinculado(lista);
  };

  // Obtiene los cursos más recientes (IDs más altos)
  const novedades = () => {
    return filtrarCursosVinculado(cursos.slice().sort((a, b) => b.id - a.id));
  };

  // Obtiene todos los cursos ordenados por su puntuación media
  const cursosPopulares = () => {
    return filtrarCursosVinculado(
      cursos.slice().sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0)),
    );
  };

  // Obtiene los cursos creados por el profesor logueado
  const misCursos = () => {
    return cursos.filter((c) => c.profesor === usuario?.id) || [];
  };

  // Redirige al listado general de cursos filtrando por la categoría seleccionada
  const handleCategoryClick = (categoria) => {
    navigate(`/Home/Courses`, { state: { selectedCategory: categoria } });
  };

  // Elimina un curso y todo su contenido asociado (Solo Profesor)
  const handleDeleteCurso = async (cursoId, e) => {
    e.stopPropagation(); // Evita que se abra el curso al pulsar en borrar
    
    // Pide confirmación al usuario (requiere escribir motivo/nombre)
    const result = await showConfirm(
      "¿Estás seguro de que quieres borrar este curso? Se eliminará TODO su contenido (videos, apuntes, ejercicios...) y NO se podrá recuperar.",
      "Eliminar Curso",
      { withInput: true },
    );
    if (result === false) return;

    try {
      // Si el modal devuelve un string, lo adjuntamos como motivo en la querystring
      const url = typeof result === "string" && result.trim()
          ? `${API_URL}/cursos/${cursoId}?reason=${encodeURIComponent(result)}`
          : `${API_URL}/cursos/${cursoId}`;

      const res = await fetch(url, { method: "DELETE" });
      
      if (res.ok) {
        // Actualizamos el estado para remover el curso visualmente sin recargar la página
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
  // Muestra mensaje de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="page-container">
        <p className="loading-message">Cargando tu espacio...</p>
      </div>
    );
  }

  // Muestra mensaje de error si falló la conexión con la base de datos
  if (error) {
    return (
      <div className="page-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Cabecera con saludo personalizado */}
      <div className="page-header-container">
        <h1>
          Bienvenido/a:{" "}
          {usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Usuario"}
        </h1>
        {/* Toggle para habilitar/deshabilitar el modo borrado (Solo Profesores) */}
        {isProfesor && (
          <button
            onClick={() => setIsDeleting(!isDeleting)}
            className="button-delete-mode"
            title="Borrar cursos"
          >
            <img
              src={DeleteIcon}
              alt="Papelera"
              className={`icon-delete-mode ${isDeleting ? "active" : "inactive"}`}
            />
          </button>
        )}
      </div>

      {/* Renderizado condicional basado en el rol del usuario */}
      {isEstudiante || isAdmin ? (
        <div className="page-sections">
          {/* Carrusel de novedades (últimos cursos subidos) */}
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
                <p className="empty-message">No se han encontrado cursos en esta sección.</p>
              )}
            </SliderComponent>
          </div>

          {/* Carrusel de cursos matriculados (Solo visible para alumnos) */}
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
                  <p className="empty-message">Aún no estás apuntado a ningún curso. ¡Explora el catálogo!</p>
                )}
              </SliderComponent>
            </div>
          )}

          {/* Botonera de acceso rápido por categorías de cursos */}
          <div className="section-categories">
            <h2>Categorías</h2>
            <div className="category-buttons">
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  className="category-button"
                  onClick={() => handleCategoryClick(categoria)}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>

          {/* Carrusel de cursos ordenados por valoración media */}
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
                <p className="empty-message">No se han encontrado cursos en esta sección.</p>
              )}
            </SliderComponent>
          </div>
        </div>
      ) : (
        /* Vista de Profesor: Cuadrícula con los cursos que imparte para su gestión */
        <div className="page-grid-professor">
          <h2>Tus cursos</h2>
          <div className="grid-courses">
            {misCursos().length === 0 ? (
              <p className="empty-message">Aún no has creado ningún curso.</p>
            ) : (
              misCursos().map((c) => (
                <CourseCard
                  key={c.id}
                  name={c.nombreCurso}
                  cursoId={c.id}
                  categoria={c.categoria}
                  nivel={c.nivel}
                  descripcion={c.descripcion}
                  profesor={usuario ? `${usuario.nombre} ${usuario.apellidos}` : ""}
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
