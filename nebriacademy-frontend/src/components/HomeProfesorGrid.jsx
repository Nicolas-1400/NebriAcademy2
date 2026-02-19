import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import TarjetaCursos from "./TarjetaCursos";
import Eliminar from "../assets/Eliminar.png";

function HomeProfesorGrid() {
  // Estados
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const storeUser = useAuthStore((state) => state.user);

  // Efectos
  useEffect(() => {
    if (!storeUser) return;
    setUsuario(storeUser);
    fetchCursosProfesor(storeUser.id);
  }, [storeUser]);

  // Handlers
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
      const res = await fetch(`http://localhost:3000/cursos/${cursoId}`, {
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

  if (error) return <div>{error}</div>;

  return (
    <div className="home-profesor-grid">
      <div className="header-container">
        <h1>
          Bienvenido/a:{" "}
          {usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Usuario"}
        </h1>
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
      </div>

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
              imagen={c.imagen}
              isDeleting={isDeleting}
              onDelete={(e) => handleDeleteCurso(c.id, e)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default HomeProfesorGrid;
