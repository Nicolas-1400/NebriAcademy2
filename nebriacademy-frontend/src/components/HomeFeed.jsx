// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useEffect, useState, useRef } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import TarjetaCursoPequena from "./TarjetaCursoPequena";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// Portada principal de la plataforma. Muestra cursos agrupados en carruseles:
// Novedades, Cursos en curso (matriculados) y Populares, además de filtros por categoría.
function HomeFeed() {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================

  // Datos del usuario y listas de contenido
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [cursosAlumnos, setCursosAlumnos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Control de estado de la UI
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Referencias para manipular programáticamente los carruseles (flechas de navegación)
  const navigate = useNavigate();
  const novedadesSliderRef = useRef(null);
  const tusCursosSliderRef = useRef(null);
  const popularesSliderRef = useRef(null);

  const storeUser = useAuthStore((state) => state.user);

  // ==========================================
  // 4. EFECTOS
  // ==========================================

  // Sincroniza el usuario autenticado desde el estado global de zustand
  useEffect(() => {
    if (storeUser) setUsuario(storeUser);
  }, [storeUser]);

  // Carga paralela de los recursos iniciales requeridos para pintar el Feed
  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch("http://localhost:3000/cursos").then((res) => res.json()),
      fetch("http://localhost:3000/cursosalumnos").then((res) => res.json()),
      fetch("http://localhost:3000/cursos/categorias")
        .then((res) => res.json())
        .catch(() => ({ categorias: [] })), // Prevención de fallos silenciosos en categorías
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

  // Workaround para react-slick: fuerza un recálculo de dimensiones del carrusel
  // una vez que el DOM se ha cargado para evitar problemas visuales de alineación.
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

  // ==========================================
  // 5. CÁLCULOS Y LÓGICA DE NEGOCIO
  // ==========================================

  // Filtra los cursos a los que el usuario logueado está apuntado de forma activa
  const tusCursos = () => {
    if (!usuario) return [];

    return cursosAlumnos
      .filter((ca) => ca.alumnoId === usuario.id && ca.apuntado)
      .map((ca) => cursos.find((c) => c.id === ca.cursoId))
      .filter((c) => c) // Purga posibles asociaciones huérfanas
      .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  };

  // Simula "Novedades" basándose en el ID descendente (últimos ingresados)
  const novedades = () => {
    return cursos.slice().sort((a, b) => b.id - a.id);
  };

  // Ordena la lista general de cursos basándose en la mejor valoración primero
  const cursosPopulares = () => {
    return cursos
      .slice()
      .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  };

  // ==========================================
  // 6. FUNCIONES Y MANEJADORES DE EVENTOS
  // ==========================================

  // Navega al grid principal de cursos pre-aplicando un filtro de categoría
  const handleCategoryClick = (categoria) => {
    navigate(`/Home/Cursos`, { state: { selectedCategory: categoria } });
  };

  // Ejecuta métodos internos del componente Slider para desplazamiento horizontal
  const handleSliderArrow = (sliderRef, direction) => {
    if (!sliderRef.current) return;

    direction === "left"
      ? sliderRef.current.slickPrev()
      : sliderRef.current.slickNext();
  };

  // ==========================================
  // 7. RENDERIZADO
  // ==========================================

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

  // ==========================================
  // 8. Configuración base de parámetros responsivos e interactivos para slick-carousel
  // ==========================================
  const settingsSlider = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="HomeFeed">
      <h1>
        Bienvenido/a:{" "}
        {usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Usuario"}
      </h1>

      <div className="HomeFeed-secciones">
        {/* --- SECCIÓN: NOVEDADES RECIENTES --- */}
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

        {/* --- SECCIÓN: CURSOS DEL USUARIO --- */}
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

        {/* --- SECCIÓN: CATEGORÍAS DISPONIBLES --- */}
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

        {/* --- SECCIÓN: CURSOS MEJOR VALORADOS --- */}
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
    </div>
  );
}

// ==========================================
// 9. EXPORTACIONES
// ==========================================
export default HomeFeed;
