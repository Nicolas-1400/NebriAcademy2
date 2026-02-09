import { useEffect, useState, useRef } from "react";
import useAuthStore from "../store/useAuthStore";
import TarjetaCursoPequena from "./TarjetaCursoPequena";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function MiEspacioGrid() {
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [cursosAlumnos, setCursosAlumnos] = useState([]);
  const [apuntes, setApuntes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const cursosEnProcesoSliderRef = useRef(null);
  const cursosFavoritosSliderRef = useRef(null);
  const tusApuntesSliderRef = useRef(null);
  const apuntesGuardadosSliderRef = useRef(null);

  const storeUser = useAuthStore((state) => state.user);

  useEffect(() => {
    if (storeUser) setUsuario(storeUser);
  }, [storeUser]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch("http://localhost:3000/cursos").then((r) => r.json()),
      fetch("http://localhost:3000/cursosalumnos").then((r) => r.json()),
      fetch("http://localhost:3000/apuntes").then((r) => r.json()),
    ])
      .then(([cursosData, cursosAlumnosData, apuntesData]) => {
        setCursos(cursosData.Cursos || []);
        setCursosAlumnos(cursosAlumnosData.CursosAlumnos || []);
        setApuntes(apuntesData.Apuntes || []);
      })
      .catch((err) => {
        console.error("Error cargando datos:", err);
        setError("Error al cargar datos");
      })
      .finally(() => setLoading(false));
  }, []);

  // Sección 1: Cursos en proceso (cursos en los que está apuntado)
  const cursosEnProceso = () => {
    if (!usuario) return [];
    const cursosApuntados = cursosAlumnos
      .filter((ca) => ca.alumnoId === usuario.id && ca.apuntado)
      .map((ca) => cursos.find((c) => c.id === ca.cursoId))
      .filter((c) => c);
    return cursosApuntados
      .slice()
      .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  };

  // Sección 2: Cursos favoritos (cursos marcados como favoritos)
  const cursosFavoritos = () => {
    if (!usuario) return [];
    const favoritos = cursosAlumnos
      .filter((ca) => ca.alumnoId === usuario.id && ca.favorito)
      .map((ca) => cursos.find((c) => c.id === ca.cursoId))
      .filter((c) => c);
    return favoritos
      .slice()
      .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  };

  // Sección 3: Tus apuntes (apuntes creados por el usuario)
  const tusApuntes = () => {
    if (!usuario) return [];
    return apuntes.filter((a) => a.alumnoId === usuario.id);
  };

  // Sección 4: Apuntes guardados (apuntes favoritos del usuario)
  const apuntesGuardados = () => {
    if (!usuario) return [];
    return apuntes.filter((a) => a.guardado && a.alumnoId !== usuario.id);
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
        [
          cursosEnProcesoSliderRef,
          cursosFavoritosSliderRef,
          tusApuntesSliderRef,
          apuntesGuardadosSliderRef,
        ].forEach((ref) => {
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
      <div className="MiEspacio">
        <p>Cargando contenido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="MiEspacio">
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
    <div className="MiEspacio">
      <h1>
        Tu espacio{" "}
        {usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Usuario"}
      </h1>
      <div className="MiEspacio-secciones">
        <div className="MiEspacio-seccion-cursos-proceso">
          <h2>Cursos en proceso</h2>
          <div className="MiEspacio-carousel-container">
            <button
              className="carousel-btn carousel-btn-left"
              onClick={() =>
                handleSliderArrow(cursosEnProcesoSliderRef, "left")
              }
              aria-label="Anterior"
            >
              ‹
            </button>
            <Slider
              ref={cursosEnProcesoSliderRef}
              {...settingsSlider}
              className="MiEspacio-cursos-proceso-carousel"
            >
              {cursosEnProceso().length > 0 ? (
                cursosEnProceso().map((curso) => (
                  <TarjetaCursoPequena
                    key={curso.id}
                    name={curso.nombreCurso}
                    cursoId={curso.id}
                    nivel={curso.nivel}
                    valoracion={curso.valoracion || 0}
                  />
                ))
              ) : (
                <p className="mensaje-vacio">No tienes cursos en proceso</p>
              )}
            </Slider>
            <button
              className="carousel-btn carousel-btn-right"
              onClick={() =>
                handleSliderArrow(cursosEnProcesoSliderRef, "right")
              }
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>
        </div>
        <div className="MiEspacio-seccion-cursos-favoritos">
          <h2>Cursos favoritos</h2>
          <div className="MiEspacio-carousel-container">
            <button
              className="carousel-btn carousel-btn-left"
              onClick={() =>
                handleSliderArrow(cursosFavoritosSliderRef, "left")
              }
              aria-label="Anterior"
            >
              ‹
            </button>
            <Slider
              ref={cursosFavoritosSliderRef}
              {...settingsSlider}
              className="MiEspacio-cursos-favoritos-carousel"
            >
              {cursosFavoritos().length > 0 ? (
                cursosFavoritos().map((curso) => (
                  <TarjetaCursoPequena
                    key={curso.id}
                    name={curso.nombreCurso}
                    cursoId={curso.id}
                    nivel={curso.nivel}
                    valoracion={curso.valoracion || 0}
                  />
                ))
              ) : (
                <p className="mensaje-vacio">No tienes cursos favoritos aún</p>
              )}
            </Slider>
            <button
              className="carousel-btn carousel-btn-right"
              onClick={() =>
                handleSliderArrow(cursosFavoritosSliderRef, "right")
              }
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>
        </div>
        <div className="MiEspacio-seccion-tus-apuntes">
          <h2>Tus apuntes</h2>
          <div className="MiEspacio-carousel-container">
            <button
              className="carousel-btn carousel-btn-left"
              onClick={() => handleSliderArrow(tusApuntesSliderRef, "left")}
              aria-label="Anterior"
            >
              ‹
            </button>
            <Slider
              ref={tusApuntesSliderRef}
              {...settingsSlider}
              className="MiEspacio-tus-apuntes-carousel"
            >
              {tusApuntes().length > 0 ? (
                tusApuntes().map((apunte) => (
                  <div key={apunte.id} className="tarjeta-apunte">
                    <h4>{apunte.nombre || apunte.titulo}</h4>
                    <p>{apunte.descripcion || "Sin descripción"}</p>
                  </div>
                ))
              ) : (
                <p className="mensaje-vacio">No tienes apuntes creados aún</p>
              )}
            </Slider>
            <button
              className="carousel-btn carousel-btn-right"
              onClick={() => handleSliderArrow(tusApuntesSliderRef, "right")}
              aria-label="Siguiente"
            >
              ›
            </button>
          </div>
        </div>
        <div className="MiEspacio-seccion-apuntes-guardados">
          <h2>Apuntes guardados</h2>
          <div className="MiEspacio-carousel-container">
            <button
              className="carousel-btn carousel-btn-left"
              onClick={() =>
                handleSliderArrow(apuntesGuardadosSliderRef, "left")
              }
              aria-label="Anterior"
            >
              ‹
            </button>
            <Slider
              ref={apuntesGuardadosSliderRef}
              {...settingsSlider}
              className="MiEspacio-apuntes-guardados-carousel"
            >
              {apuntesGuardados().length > 0 ? (
                apuntesGuardados().map((apunte) => (
                  <div key={apunte.id} className="tarjeta-apunte">
                    <h4>{apunte.nombre || apunte.titulo}</h4>
                    <p>{apunte.descripcion || "Sin descripción"}</p>
                  </div>
                ))
              ) : (
                <p className="mensaje-vacio">No tienes apuntes guardados aún</p>
              )}
            </Slider>
            <button
              className="carousel-btn carousel-btn-right"
              onClick={() =>
                handleSliderArrow(apuntesGuardadosSliderRef, "right")
              }
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

export default MiEspacioGrid;
