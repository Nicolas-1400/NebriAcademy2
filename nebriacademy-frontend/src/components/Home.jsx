// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../config/api";
import { useEffect, useState, useRef } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import TarjetaCursoPequena from "./TarjetaCursoPequena";
import TarjetaCursos from "./TarjetaCursos";
import Slider from "react-slick";
import Eliminar from "../assets/Eliminar.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Componente Home unificado para alumnos y profesores
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

  // Referencias a sliders para navegación manual
  const novedadesSliderRef = useRef(null);
  const tusCursosSliderRef = useRef(null);
  const popularesSliderRef = useRef(null);

  // Detectar si es alumno o profesor (usar el tipo del store que es la autoridad)
  const isEstudiante = tipoUsuario === "alumno";

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

        if (isEstudiante) {
          const datosCursosAlumnos = await fetch(
            `${API_URL}/cursosalumnos`,
          ).then((r) => r.json());
          setCursosAlumnos(datosCursosAlumnos.CursosAlumnos || []);

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
  }, [isEstudiante]);

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

  // [ALUMNO] Ordenar por ID descendente (novedades)
  const novedades = () => {
    return filtrarCursosVinculado(cursos.slice().sort((a, b) => b.id - a.id));
  };

  // [ALUMNO] Ordenar por valoración (populares)
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

  // Controlar slider
  const handleSliderArrow = (sliderRef, direction) => {
    if (!sliderRef.current) return;
    direction === "left"
      ? sliderRef.current.slickPrev()
      : sliderRef.current.slickNext();
  };

  // Refrescar sliders al cargar
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => {
        [novedadesSliderRef, tusCursosSliderRef, popularesSliderRef].forEach(
          (ref) => {
            if (ref?.current?.innerSlider) {
              // Forzar recalcular el ancho y breakpoints
              ref.current.innerSlider.handleWindowResize?.();
            }
            try {
              ref?.current?.slickGoTo(0);
            } catch (e) {}
          },
        );
      }, 100);
      return () => clearTimeout(t);
    }
  }, [loading, cursos]);

  // Eliminar curso (profesor)
  const handleDeleteCurso = async (cursoId, e) => {
    e.stopPropagation();
    if (
      !window.confirm(
        "¿Estás seguro de que quieres borrar este curso? Se eliminará TODO su contenido (vídeos, apuntes, ejercicios...) y NO se podrá recuperar.",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/cursos/${cursoId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCursos((prev) => prev.filter((c) => c.id !== cursoId));
      } else {
        alert("Error al eliminar el curso");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  // Configuración de slider
  const settingsSlider = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  // ── RENDER ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="home-container">
        <p>Cargando contenido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header-container">
        <h1>
          Bienvenido/a:{" "}
          {usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Usuario"}
        </h1>
        {/* Botón de eliminar solo para profesores */}
        {!isEstudiante && (
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

      {/* VISTA ALUMNO */}
      {isEstudiante ? (
        <div className="home-sections">
          {/* Sección Novedades */}
          <div className="home-section-carousel">
            <h2>Novedades</h2>
            <div className="home-carousel-container">
              <button
                className="carousel-btn carousel-btn-left"
                onClick={() => handleSliderArrow(novedadesSliderRef, "left")}
                aria-label="Anterior"
              >
                ‹
              </button>
              <Slider
                ref={novedadesSliderRef}
                {...settingsSlider}
                className="home-carousel"
              >
                {novedades().length > 0 ? (
                  novedades().map((curso) => (
                    <TarjetaCursoPequena
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
              </Slider>
              <button
                className="carousel-btn carousel-btn-right"
                onClick={() => handleSliderArrow(novedadesSliderRef, "right")}
                aria-label="Siguiente"
              >
                ›
              </button>
            </div>
          </div>

          {/* Sección Tus cursos */}
          <div className="home-section-carousel">
            <h2>Tus cursos</h2>
            <div className="home-carousel-container">
              <button
                className="carousel-btn carousel-btn-left"
                onClick={() => handleSliderArrow(tusCursosSliderRef, "left")}
                aria-label="Anterior"
              >
                ‹
              </button>
              <Slider
                ref={tusCursosSliderRef}
                {...settingsSlider}
                className="home-carousel"
              >
                {tusCursos().length > 0 ? (
                  tusCursos().map((curso) => (
                    <TarjetaCursoPequena
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
              </Slider>
              <button
                className="carousel-btn carousel-btn-right"
                onClick={() => handleSliderArrow(tusCursosSliderRef, "right")}
                aria-label="Siguiente"
              >
                ›
              </button>
            </div>
          </div>

          {/* Sección Categorías */}
          <div className="home-section-categorias">
            <h2>Categorías</h2>
            <div className="home-categorias-buttons">
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  className="categoria-btn"
                  onClick={() => handleCategoryClick(categoria)}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>

          {/* Sección Cursos populares */}
          <div className="home-section-carousel">
            <h2>Cursos populares</h2>
            <div className="home-carousel-container">
              <button
                className="carousel-btn carousel-btn-left"
                onClick={() => handleSliderArrow(popularesSliderRef, "left")}
                aria-label="Anterior"
              >
                ‹
              </button>
              <Slider
                ref={popularesSliderRef}
                {...settingsSlider}
                className="home-carousel"
              >
                {cursosPopulares().length > 0 ? (
                  cursosPopulares().map((curso) => (
                    <TarjetaCursoPequena
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
              </Slider>
              <button
                className="carousel-btn carousel-btn-right"
                onClick={() => handleSliderArrow(popularesSliderRef, "right")}
                aria-label="Siguiente"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* VISTA PROFESOR */
        <div className="home-grid-profesor">
          <h2>Tus cursos</h2>
          <div className="home-grid-cursos">
            {misCursos().length === 0 ? (
              <p className="home-mensaje-vacio">
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
