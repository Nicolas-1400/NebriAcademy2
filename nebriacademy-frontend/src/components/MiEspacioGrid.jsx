import { useEffect, useState, useRef, useMemo } from "react";
import useAuthStore from "../store/useAuthStore";
import TarjetaCursoPequena from "./TarjetaCursoPequena";
import TarjetaApunte from "./TarjetaApunte";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function MiEspacioGrid() {
  const { user } = useAuthStore();
  const [data, setData] = useState({
    cursos: [],
    cursosAlumnos: [],
    apuntes: [],
    alumnos: [],
    profesores: [],
  });
  const [likedApuntes, setLikedApuntes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sliders = {
    proceso: useRef(null),
    favCursos: useRef(null),
    misApuntes: useRef(null),
    favApuntes: useRef(null),
  };

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const [
          respuestaCursos,
          respuestaCursosAlumnos,
          respuestaApuntes,
          respuestaAlumnos,
          respuestaProfesores,
        ] = await Promise.all([
          fetch("http://localhost:3000/cursos").then((respuesta) =>
            respuesta.json(),
          ),
          fetch("http://localhost:3000/cursosalumnos").then((respuesta) =>
            respuesta.json(),
          ),
          fetch("http://localhost:3000/apuntes").then((respuesta) =>
            respuesta.json(),
          ),
          fetch("http://localhost:3000/alumnos").then((respuesta) =>
            respuesta.json(),
          ),
          fetch("http://localhost:3000/profesores").then((respuesta) =>
            respuesta.json(),
          ),
        ]);

        setData({
          cursos: respuestaCursos.Cursos || [],
          cursosAlumnos: respuestaCursosAlumnos.CursosAlumnos || [],
          apuntes: respuestaApuntes.Apuntes || [],
          alumnos: respuestaAlumnos.Alumnos || [],
          profesores: respuestaProfesores.Profesores || [],
        });
      } catch (error) {
        console.error(error);
        setError("Error cargando datos.");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:3000/apuntesalumnos/likes?alumnoId=${user.id}`)
      .then((respuesta) => respuesta.json())
      .then((datos) => setLikedApuntes(datos.apunteIds || []))
      .catch(console.error);
  }, [user]);

  const cursosEnProceso = useMemo(() => {
    if (!user) return [];
    return data.cursosAlumnos
      .filter((ca) => ca.alumnoId === user.id && ca.apuntado)
      .map((ca) => data.cursos.find((c) => c.id === ca.cursoId))
      .filter(Boolean)
      .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  }, [data, user]);

  const cursosFavoritos = useMemo(() => {
    if (!user) return [];
    return data.cursosAlumnos
      .filter((ca) => ca.alumnoId === user.id && ca.favorito)
      .map((ca) => data.cursos.find((c) => c.id === ca.cursoId))
      .filter(Boolean)
      .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  }, [data, user]);

  const misApuntes = useMemo(() => {
    if (!user) return [];
    return data.apuntes.filter(
      (a) => Number(a.autor) === Number(user.usuarioId),
    );
  }, [data, user]);

  const apuntesFavoritos = useMemo(() => {
    if (!user) return [];
    return data.apuntes.filter((a) => likedApuntes.includes(a.id));
  }, [data, user, likedApuntes]);

  const resolveAutorName = (autorId) => {
    const aid = Number(autorId);
    if (!aid) return "";
    const alum = data.alumnos.find(
      (a) => Number(a.usuarioId) === aid || Number(a.id) === aid,
    );
    if (alum) return `${alum.nombre} ${alum.apellidos}`;
    const prof = data.profesores.find(
      (p) => Number(p.usuarioId) === aid || Number(p.id) === aid,
    );
    if (prof) return `${prof.nombre} ${prof.apellidos}`;
    return "Anónimo";
  };

  const handleToggleLike = async (apunte) => {
    if (!user) return;
    try {
      const res = await fetch("http://localhost:3000/apuntesalumnos/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apunteId: apunte.id,
          alumnoId: user.id,
          vote: true,
        }),
      });
      const d = await res.json();
      if (res.ok) {
        const isLike = d.registro?.valoracion === true;
        setLikedApuntes((prev) =>
          isLike ? [...prev, apunte.id] : prev.filter((id) => id !== apunte.id),
        );
        const newVal = d.apunte?.valoracion;
        setData((D) => ({
          ...D,
          apuntes: D.apuntes.map((a) =>
            a.id === apunte.id ? { ...a, valoracion: newVal } : a,
          ),
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const slide = (ref, dir) => {
    if (ref.current)
      dir === "left" ? ref.current.slickPrev() : ref.current.slickNext();
  };

  useEffect(() => {
    if (!loading) {
      setTimeout(
        () => Object.values(sliders).forEach((r) => r.current?.slickGoTo(0)),
        100,
      );
    }
  }, [loading, data]);

  if (loading)
    return (
      <div className="MiEspacio">
        <p>Cargando espacio personal...</p>
      </div>
    );
  if (error)
    return (
      <div className="MiEspacio">
        <p>{error}</p>
      </div>
    );

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
    ],
  };

  const renderSection = (title, items, sliderRef, type) => (
    <div className={`MiEspacio-seccion-${type}`}>
      <h2>{title}</h2>
      <div className="MiEspacio-carousel-container">
        <button
          className="carousel-btn carousel-btn-left"
          onClick={() => slide(sliderRef, "left")}
        >
          ‹
        </button>
        <Slider
          ref={sliderRef}
          {...sliderSettings}
          className={`MiEspacio-${type}-carousel`}
        >
          {items.length > 0 ? (
            items.map((item) =>
              type.includes("cursos") ? (
                <TarjetaCursoPequena
                  key={item.id}
                  name={item.nombreCurso}
                  cursoId={item.id}
                  nivel={item.nivel}
                  valoracion={item.valoracion || 0}
                  imagen={item.imagen}
                />
              ) : (
                <div key={item.id} className="apuntes-slide apuntes-list">
                  <ul>
                    <TarjetaApunte
                      apunte={item}
                      usuario={user}
                      likedIds={likedApuntes}
                      onToggleLike={handleToggleLike}
                      autorNombre={resolveAutorName(item.autor)}
                    />
                  </ul>
                </div>
              ),
            )
          ) : (
            <p className="mensaje-vacio">No hay elementos.</p>
          )}
        </Slider>
        <button
          className="carousel-btn carousel-btn-right"
          onClick={() => slide(sliderRef, "right")}
        >
          ›
        </button>
      </div>
    </div>
  );

  return (
    <div className="MiEspacio">
      <h1>Tu espacio {user ? `${user.nombre} ${user.apellidos}` : ""}</h1>
      <div className="MiEspacio-secciones">
        {renderSection(
          "Cursos en proceso",
          cursosEnProceso,
          sliders.proceso,
          "cursos-proceso",
        )}
        {renderSection(
          "Cursos favoritos",
          cursosFavoritos,
          sliders.favCursos,
          "cursos-favoritos",
        )}
        {renderSection(
          "Tus apuntes",
          misApuntes,
          sliders.misApuntes,
          "tus-apuntes",
        )}
        {renderSection(
          "Apuntes favoritos",
          apuntesFavoritos,
          sliders.favApuntes,
          "apuntes-guardados",
        )}
      </div>
    </div>
  );
}

export default MiEspacioGrid;
