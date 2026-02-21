// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import TarjetaCursos from "./TarjetaCursos";
import Eliminar from "../assets/Eliminar.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Home del profesor: muestra sus cursos y permite eliminarlos con confirmación
function HomeProfesorGrid() {
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState(null);
  // isDeleting activa el botón de eliminar visible sobre cada tarjeta de curso
  const [isDeleting, setIsDeleting] = useState(false);

  const storeUser = useAuthStore((state) => state.user);

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Cuando el usuario del store esté disponible, lo guardamos y cargamos sus cursos
  useEffect(() => {
    if (!storeUser) return;
    setUsuario(storeUser);
    fetchCursosProfesor(storeUser.id);
  }, [storeUser]);

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Obtiene todos los cursos y filtra solo los que pertenecen al profesor logueado
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

  // Pide confirmación y borra el curso del backend. Si el borrado tiene éxito, actualiza la lista local.
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

  // ── RENDER ───────────────────────────────────────────────────────────────────
  if (error) return <div>{error}</div>;

  return (
    <div className="home-profesor-grid">
      <div className="header-container">
        <h1>
          Bienvenido/a:{" "}
          {usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Usuario"}
        </h1>
        {/* Botón de papelera para activar/desactivar el modo borrado sobre los cursos */}
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
        <h2>Tus cursos</h2>
        <div className="grid-cursos-profesor-cursos">
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
                profesor={
                  usuario ? `${usuario.nombre} ${usuario.apellidos}` : ""
                }
                valoracion={c.valoracion}
                imagen={c.imagen}
                isDeleting={isDeleting}
                onDelete={(e) => handleDeleteCurso(c.id, e)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeProfesorGrid;
