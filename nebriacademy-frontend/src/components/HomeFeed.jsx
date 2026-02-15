import { useEffect, useState, useRef } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import TarjetaCursoPequena from "./TarjetaCursoPequena";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/**
 * Componente de feed principal para alumnos
 * Muestra secciones de: Tus Cursos, Novedades, Cursos Populares y filtros por categoría
 * Incluye carruseles interactivos para navegar entre cursos
 */
/**
 * Componente: HomeFeed
 * Página principal del alumno. Muestra novedades, cursos populares y tus cursos.
 */
function HomeFeed() {
  // --- Estados ---
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [cursosAlumnos, setCursosAlumnos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // UI States
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hooks y Refs
  const navigate = useNavigate();
  const novedadesSliderRef = useRef(null);
  const tusCursosSliderRef = useRef(null);
  const popularesSliderRef = useRef(null);

  const storeUser = useAuthStore((state) => state.user);

  // --- Efectos de Carga ---

  // 1. Sincronizar el estado local con el usuario del store global
  useEffect(() => {
    if (storeUser) setUsuario(storeUser);
  }, [storeUser]);

  // 2. Carga inicial de datos concurrentemente
  // Usamos Promise.all para iniciar todas las peticiones a la vez y reducir el tiempo de espera
  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      // Obtener todos los cursos disponibles
      fetch("http://localhost:3000/cursos").then((respuesta) =>
        respuesta.json(),
      ),
      // Obtener relaciones alumno-curso (para saber en cuáles está inscrito)
      fetch("http://localhost:3000/cursosalumnos").then((respuesta) =>
        respuesta.json(),
      ),
      // Obtener listado de categorías para los filtros
      fetch("http://localhost:3000/cursos/categorias")
        .then((respuesta) => respuesta.json())
        .catch(() => ({ categorias: [] })), // Si falla categorías, no romper toda la página
    ])
      .then(([datosCursos, datosCursosAlumnos, datosCategorias]) => {
        setCursos(datosCursos.Cursos || []);
        setCursosAlumnos(datosCursosAlumnos.CursosAlumnos || []);
        setCategorias(
          Array.isArray(datosCategorias.categorias)
            ? datosCategorias.categorias
            : [],
        );
      })
      .catch((error) => {
        console.error("Error cargando datos:", error);
        setError("Error al cargar el contenido");
      })
      .finally(() => setLoading(false));
  }, []);

  // --- Lógica de Negocio (Filtros) ---

  // Filtra los cursos donde el usuario actual está matriculado (apuntado = true)
  // Devuelve los objetos de curso completos, ordenados por valoración
  const tusCursos = () => {
    if (!usuario) return [];
    return cursosAlumnos
      .filter((ca) => ca.alumnoId === usuario.id && ca.apuntado)
      .map((ca) => cursos.find((c) => c.id === ca.cursoId))
      .filter((c) => c) // Eliminar posibles nulos si no se encuentra el curso
      .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  };

  // Obtiene los cursos más recientes (asumiendo que ID mayor = más nuevo)
  // Creamos una copia con slice() para no mutar el array original al ordenar
  const novedades = () => {
    return cursos.slice().sort((a, b) => b.id - a.id);
  };

  // Obtiene los cursos con mayor valoración
  const cursosPopulares = () => {
    return cursos
      .slice()
      .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  };

  // --- Handlers ---

  const handleCategoryClick = (categoria) => {
    navigate(`/Home/Cursos`, { state: { selectedCategory: categoria } });
  };

  const handleSliderArrow = (sliderRef, direction) => {
    if (!sliderRef.current) return;
    direction === "left"
      ? sliderRef.current.slickPrev()
      : sliderRef.current.slickNext();
  };

  // Resize fix para Sliders
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => {
        [novedadesSliderRef, tusCursosSliderRef, popularesSliderRef].forEach(
          (ref) => {
            ref?.current?.innerSlider?.onWindowResized?.();
            try {
              ref?.current?.slickGoTo(0);
            } catch (e) {}
          },
        );
      }, 120);
      return () => clearTimeout(t);
    }
  }, [loading, cursos]);

  if (loading) {
    return (
      <div className="HomeFeed">
        <p>Cargando contenido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="HomeFeed">
        <p>{error}</p>
      </div>
    );
  }

  /* Slider */
  const settingsSlider = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    style: { width: "2484px !important" },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          style: { width: "2484px !important" },
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          style: { width: "1660px !important" },
        },
      },
    ],
  };

  return (
    <div className="HomeFeed">
      <h1>
        Bienvenido/a{" "}
        {usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Usuario"}
      </h1>
      <div className="HomeFeed-secciones">
        {/* Sección 1: Novedades */}
        <div className="HomeFeed-seccion-novedades">
          <h2>Novedades</h2>
          <div className="HomeFeed-carousel-container">
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
              className="HomeFeed-novedades-carousel"
            >
              {novedades().length > 0 ? (
                novedades().map((curso) => (
                  <TarjetaCursoPequena
                    key={curso.id}
                    name={curso.nombreCurso}
                    cursoId={curso.id}
                    nivel={curso.nivel}
                    valoracion={curso.valoracion || 0}
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

        {/* Sección 2: Tus Cursos */}
        <div className="HomeFeed-seccion-tus-cursos">
          <h2>Tus cursos</h2>
          <div className="HomeFeed-carousel-container">
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
              className="HomeFeed-tus-cursos-carousel"
            >
              {tusCursos().length > 0 ? (
                tusCursos().map((curso) => (
                  <TarjetaCursoPequena
                    key={curso.id}
                    name={curso.nombreCurso}
                    cursoId={curso.id}
                    nivel={curso.nivel}
                    valoracion={curso.valoracion || 0}
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

        {/* Sección 3: Categorías */}
        <div className="HomeFeed-seccion-categorias">
          <h2>Categorías</h2>
          <div className="HomeFeed-categorias-buttons">
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

        {/* Sección 4: Cursos Populares */}
        <div className="HomeFeed-seccion-cursos-populares">
          <h2>Cursos populares</h2>
          <div className="HomeFeed-carousel-container">
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
              className="HomeFeed-cursos-populares-carousel"
            >
              {cursosPopulares().length > 0 ? (
                cursosPopulares().map((curso) => (
                  <TarjetaCursoPequena
                    key={curso.id}
                    name={curso.nombreCurso}
                    cursoId={curso.id}
                    nivel={curso.nivel}
                    valoracion={curso.valoracion || 0}
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
    </div>
  );
}

export default HomeFeed;
