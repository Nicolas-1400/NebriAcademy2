// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../config/api";
import { useEffect, useState, useRef } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import TarjetaCursoPequena from "./TarjetaCursoPequena";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de inicio del alumno: muestra novedades, sus cursos y los cursos populares en carruseles
function HomeFeed() {
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // Estado: datos del usuario, lista de cursos, relaciones alumno-curso y categorías disponibles
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [cursosAlumnos, setCursosAlumnos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  // Referencias a cada slider para poder controlarlos manualmente con los botones de flecha
  const novedadesSliderRef = useRef(null);
  const tusCursosSliderRef = useRef(null);
  const popularesSliderRef = useRef(null);

  const storeUser = useAuthStore((state) => state.user);

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Sincronizamos el estado local de usuario con el store global cuando cambie
  useEffect(() => {
    if (storeUser) setUsuario(storeUser);
  }, [storeUser]);

  // Al montar el componente, cargamos cursos, relaciones alumno-curso y categorías en paralelo
  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`${API_URL}/cursos`).then((respuesta) =>
        respuesta.json(),
      ),
      fetch(`${API_URL}/cursosalumnos`).then((respuesta) =>
        respuesta.json(),
      ),
      fetch(`${API_URL}/cursos/categorias`)
        .then((respuesta) => respuesta.json())
        .catch(() => ({ categorias: [] })),
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

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Si el usuario es un alumno vinculado, filtra los cursos de su profesor vinculado
  const filtrarCursosVinculado = (lista) => {
    if (!storeUser?.esVinculado || !storeUser?.profesorVinculadoId) return lista;
    return lista.filter((c) => c.profesor !== storeUser.profesorVinculadoId);
  };

  // Filtra los cursos en los que el alumno está apuntado y los ordena por valoración
  const tusCursos = () => {
    if (!usuario) return [];
    const lista = cursosAlumnos
      .filter((ca) => ca.alumnoId === usuario.id && ca.apuntado)
      .map((ca) => cursos.find((c) => c.id === ca.cursoId))
      .filter((c) => c)
      .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
    return filtrarCursosVinculado(lista);
  };

  // Ordena todos los cursos por ID descendente para mostrar los más recientes primero
  const novedades = () => {
    return filtrarCursosVinculado(cursos.slice().sort((a, b) => b.id - a.id));
  };

  // Ordena todos los cursos por valoración descendente
  const cursosPopulares = () => {
    return filtrarCursosVinculado(
      cursos.slice().sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0))
    );
  };

  // Navega a la página de cursos con la categoría preseleccionada como filtro
  const handleCategoryClick = (categoria) => {
    navigate(`/Home/Cursos`, { state: { selectedCategory: categoria } });
  };

  // Controla el slider (izquierda/derecha) usando la referencia al componente Slider
  const handleSliderArrow = (sliderRef, direction) => {
    if (!sliderRef.current) return;
    direction === "left"
      ? sliderRef.current.slickPrev()
      : sliderRef.current.slickNext();
  };

  // Cuando los datos terminan de cargar, forzamos un refresco del tamaño de los sliders para evitar problemas de layout
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

  // Configuración del carrusel: 4 tarjetas visibles, responsive hasta 2 en móvil
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
        {/* Sección Novedades: cursos ordenados por ID descendente */}
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

        {/* Sección Tus cursos: solo los cursos en los que el alumno está inscrito */}
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

        {/* Sección Categorías: botones que filtran los cursos al hacer clic */}
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

        {/* Sección Cursos populares: todos los cursos ordenados por valoración */}
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

export default HomeFeed;
