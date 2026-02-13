import { useEffect, useState, useRef } from "react";
import useAuthStore from '../store/useAuthStore'
import { useNavigate } from "react-router-dom";
import TarjetaCursoPequena from "./TarjetaCursoPequena";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function HomeFeed() {
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [cursosAlumnos, setCursosAlumnos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const novedadesSliderRef = useRef(null);
  const tusCursosSliderRef = useRef(null);
  const popularesSliderRef = useRef(null);

  const [categorias, setCategorias] = useState([]);

  const storeUser = useAuthStore(state => state.user)
  useEffect(() => {
    if (storeUser) setUsuario(storeUser)
  }, [storeUser]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch("http://localhost:3000/cursos").then((r) => r.json()),
      fetch("http://localhost:3000/cursosalumnos").then((r) => r.json()),
    ])
      .then(([cursosData, cursosAlumnosData]) => {
        setCursos(cursosData.Cursos || []);
        setCursosAlumnos(cursosAlumnosData.CursosAlumnos || []);
        // cargar categorias desde endpoint sencillo si existe
        fetch('http://localhost:3000/cursos/categorias')
          .then((r) => r.json())
          .then((d) => setCategorias(Array.isArray(d.categorias) ? d.categorias : []))
          .catch(() => setCategorias([]));
      })
      .catch((err) => {
        console.error("Error cargando datos:", err);
        setError("Error al cargar datos");
      })
      .finally(() => setLoading(false));
  }, []);

  // Sección 1: Tus Cursos (cursos en los que está apuntado)
  const tusCursos = () => {
    if (!usuario) return [];
    const cursosApuntados = cursosAlumnos
      .filter((ca) => ca.alumnoId === usuario.id && ca.apuntado)
      .map((ca) => cursos.find((c) => c.id === ca.cursoId))
      .filter((c) => c);
    return cursosApuntados
      .slice()
      .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  };

  // Sección 2: Novedades (cursos más recientes, ordenados por ID descendente)
  const novedades = () => {
    return cursos.slice().sort((a, b) => b.id - a.id);
  };

  // Sección 3: Cursos Populares (ordenados por valoración descendente)
  const cursosPopulares = () => {
    return cursos
      .slice()
      .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  };

  const handleCategoryClick = (categoria) => {
    navigate(`/Home/Cursos`, { state: { selectedCategory: categoria } });
  };

  const handleSliderArrow = (sliderRef, direction) => {
    if (sliderRef.current) {
      if (direction === "left") {
        sliderRef.current.slickPrev();
      } else {
        sliderRef.current.slickNext();
      }
    }
  };

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => {
        [novedadesSliderRef, tusCursosSliderRef, popularesSliderRef].forEach((ref) => {
          if (ref?.current?.innerSlider?.onWindowResized) {
            ref.current.innerSlider.onWindowResized();
          }
          if (ref?.current?.slickGoTo) {
            try {
              ref.current.slickGoTo(0);
            } catch (e) {}
          }
        });
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
          style: { width: "2484px !important"}

        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          style: { width: "1660px !important"}
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
