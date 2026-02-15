import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import TarjetaCursos from "./TarjetaCursos";

/**
 * Componente de página principal para profesores
 * Muestra los cursos asignados al profesor autenticado
 */
/**
 * Componente: HomeProfesorGrid
 * Dashboard principal para profesores. Muestra sus cursos asignados.
 */
function HomeProfesorGrid() {
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState(null);

  const storeUser = useAuthStore((state) => state.user);

  // Cargar usuario y sus cursos al montar
  useEffect(() => {
    if (!storeUser) return;
    setUsuario(storeUser);
    fetchCursosProfesor(storeUser.id);
  }, [storeUser]);

  // Obtiene los cursos y filtra aquellos creados por este profesor
  const fetchCursosProfesor = async (profesorId) => {
    try {
      const respuesta = await fetch("http://localhost:3000/cursos");
      const datos = await respuesta.json();

      const todos = datos.Cursos || [];
      const misCursos = todos.filter((c) => c.profesor === profesorId);

      setCursos(misCursos);
    } catch (err) {
      console.error(err);
      setError("Error al cargar tus cursos");
    }
  };
  if (error) return <div>{error}</div>;

  return (
    <div className="home-profesor-grid">
      <h1>
        Bienvenido/a{" "}
        {usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Usuario"}
      </h1>
      <div className="grid-cursos-profesor">
        {cursos.length === 0 ? (
          <p>No tienes cursos asignados todavía.</p>
        ) : (
          cursos.map((c) => (
            <TarjetaCursos
              key={c.id}
              name={c.nombreCurso}
              cursoId={c.id}
              categoria={c.categoria}
              nivel={c.nivel}
              descripcion={c.descripcion}
              profesor={usuario ? `${usuario.nombre} ${usuario.apellidos}` : ""}
              valoracion={c.valoracion}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default HomeProfesorGrid;
