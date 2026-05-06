import '../../account/Account.css';
// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../config/api";
import { useEffect, useState, useMemo } from "react";
import useAuthStore from "../../../store/useAuthStore";
import CardSlider from "../../common/Sliders/CardSlider";
import SliderComponent from "../../common/Sliders/SliderComponent";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Espacio personal del alumno: muestra cursos en progreso, favoritos y apuntes propios y guardados
function MySpaceGrid() {
  const { user } = useAuthStore();

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // Datos principales cargados de la API
  const [data, setData] = useState({
    cursos: [],
    cursosAlumnos: [],
    apuntes: [],
    alumnos: [],
    profesores: [],
  });
  // IDs de apuntes a los que el usuario ha dado like
  const [likedApuntes, setLikedApuntes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Al montar el componente, cargamos todos los datos necesarios en paralelo
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
          fetch(`${API_URL}/cursos`).then((respuesta) =>
            respuesta.json(),
          ),
          fetch(`${API_URL}/cursosalumnos`).then((respuesta) =>
            respuesta.json(),
          ),
          fetch(`${API_URL}/apuntes`).then((respuesta) =>
            respuesta.json(),
          ),
          fetch(`${API_URL}/alumnos`).then((respuesta) =>
            respuesta.json(),
          ),
          fetch(`${API_URL}/profesores`).then((respuesta) =>
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

  // Cargamos los likes del alumno cuando el usuario esté disponible
  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/apuntesalumnos/likes?alumnoId=${user.id}`)
      .then((respuesta) => respuesta.json())
      .then((datos) => setLikedApuntes(datos.apunteIds || []))
      .catch(console.error);
  }, [user]);

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Cursos en los que el alumno está apuntado, ordenados por valoración
  const cursosEnProceso = useMemo(() => {
    if (!user) return [];
    return data.cursosAlumnos
      .filter((ca) => ca.alumnoId === user.id && ca.apuntado)
      .map((ca) => data.cursos.find((c) => c.id === ca.cursoId))
      .filter(Boolean)
      .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  }, [data, user]);

  // Cursos que el alumno ha marcado como favorito
  const cursosFavoritos = useMemo(() => {
    if (!user) return [];
    return data.cursosAlumnos
      .filter((ca) => ca.alumnoId === user.id && ca.favorito)
      .map((ca) => data.cursos.find((c) => c.id === ca.cursoId))
      .filter(Boolean)
      .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  }, [data, user]);

  // Apuntes cuyo autor es el alumno logueado (comparamos por usuarioId)
  const misApuntes = useMemo(() => {
    if (!user) return [];
    return data.apuntes.filter(
      (a) => Number(a.autor) === Number(user.usuarioId),
    );
  }, [data, user]);

  // Apuntes a los que el alumno ha dado like
  const apuntesFavoritos = useMemo(() => {
    if (!user) return [];
    return data.apuntes.filter((a) => likedApuntes.includes(a.id));
  }, [data, user, likedApuntes]);

  // Resuelve el nombre del autor de un apunte buscando primero entre alumnos y luego entre profesores
  const resolveAutorName = (autorId) => {
    const aid = Number(autorId);
    if (!aid) return "";
    const alum = data.alumnos.find(
      (a) => Number(a.usuarioId) === aid,
    );
    if (alum) return `${alum.nombre} ${alum.apellidos}`;
    const prof = data.profesores.find(
      (p) => Number(p.usuarioId) === aid,
    );
    if (prof) return `${prof.nombre} ${prof.apellidos}`;
    return "Autor no encontrado";
  };

  // Alterna el like de un apunte: actualiza el backend y luego el estado local
  const handleToggleLike = async (apunte) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/apuntesalumnos/vote`, {
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
        // Actualizamos la lista local de apuntes con like
        setLikedApuntes((prev) =>
          isLike ? [...prev, apunte.id] : prev.filter((id) => id !== apunte.id),
        );
        // Actualizamos el contador de likes visible en la tarjeta
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

  if (loading)
    return (
      <div className="page-container">
        <p className="mensaje-cargando">Cargando tu espacio personal...</p>
      </div>
    );
  if (error)
    return (
      <div className="page-container">
        <p>{error}</p>
      </div>
    );

  // Renderiza una sección genérica con título y carrusel.
  const renderSection = (title, items, type) => (
    <div className={`section-carousel section-${type}`}>
      <h2>{title}</h2>
      <SliderComponent>
        {items.length > 0 ? (
          items.map((item) =>
            type.includes("cursos") ? (
              <CardSlider
                key={item.id}
                name={item.nombreCurso}
                cursoId={item.id}
                nivel={item.nivel}
                valoracion={item.valoracion || 0}
                imagen={item.imagen}
              />
            ) : (
              <CardSlider
                key={item.id}
                type="apunte"
                apunte={item}
                likedIds={likedApuntes}
                onToggleLike={handleToggleLike}
                autorNombre={resolveAutorName(item.autor)}
              />
            ),
          )
        ) : (
          <p className="mensaje-vacio">No hay {title.toLowerCase()} registrados.</p>
        )}
      </SliderComponent>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header-container">
        <h1>Tu espacio {user ? `${user.nombre} ${user.apellidos}` : ""}</h1>
      </div>
      <div className="page-sections">
        {renderSection("Cursos en proceso", cursosEnProceso, "cursos-proceso")}
        {renderSection("Cursos favoritos", cursosFavoritos, "cursos-favoritos")}
        {renderSection("Tus apuntes", misApuntes, "tus-apuntes")}
        {renderSection("Apuntes favoritos", apuntesFavoritos, "apuntes-guardados")}
      </div>
    </div>
  );
}

export default MySpaceGrid;




