import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TarjetaCursoPequena from "./TarjetaCursoPequena";

function HomeFeed() {
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [cursosAlumnos, setCursosAlumnos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const CATEGORIAS = [
    "Programación",
    "Diseño",
    "Ciberseguridad",
    "BDD",
    "Marketing",
  ];

  useEffect(() => {
    const usuarioIniciado = localStorage.getItem("usuario");
    if (usuarioIniciado) {
      setUsuario(JSON.parse(usuarioIniciado));
    }
  }, []);

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
    return cursosApuntados.slice(0, 10);
  };

  // Sección 2: Novedades (cursos más recientes, ordenados por ID descendente)
  const novedades = () => {
    return cursos
      .slice()
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
  };

  // Sección 3: Cursos Populares (ordenados por valoración descendente)
  const cursosPopulares = () => {
    return cursos
      .slice()
      .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0))
      .slice(0, 10);
  };

  const handleCategoryClick = (categoria) => {
    navigate(`/Home/Cursos`, { state: { selectedCategory: categoria } });
  };

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

  return (
    
    <div className="HomeFeed">
      <h1>
        Bienvenido/a {usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Usuario"}
      </h1>
      <div className="HomeFeed-secciones">
        {/* Sección 1: Novedades */}
        <div className="HomeFeed-seccion-novedades">
          <h2>Novedades</h2>
          <div className="HomeFeed-novedades-carousel">
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
          </div>
        </div>

        {/* Sección 2: Tus Cursos */}
        <div className="HomeFeed-seccion-tus-cursos">
          <h2>Tus cursos</h2>
          <div className="HomeFeed-tus-cursos-carousel">
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
          </div>
        </div>

        {/* Sección 3: Categorías */}
        <div className="HomeFeed-seccion-categorias">
          <h2>Categorías</h2>
          <div className="HomeFeed-categorias-buttons">
            {CATEGORIAS.map((categoria) => (
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
          <div className="HomeFeed-cursos-populares-carousel">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeFeed;
