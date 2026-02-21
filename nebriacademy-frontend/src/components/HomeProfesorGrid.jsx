// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import TarjetaCursos from "./TarjetaCursos";
import Eliminar from "../assets/Eliminar.png";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// Dashboard principal del profesor. Muestra los cursos que imparte y permite eliminarlos.
function HomeProfesorGrid() {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState(null);

  // Controla si la interfaz está en modo de eliminación (muestra iconos de papelera en los cursos)
  const [isDeleting, setIsDeleting] = useState(false);

  // Obtiene el usuario autenticado del store global
  const storeUser = useAuthStore((state) => state.user);

  // ==========================================
  // 4. EFECTOS
  // ==========================================
  // Inicializa el componente cargando los cursos del profesor cuando el usuario está disponible
  useEffect(() => {
    if (!storeUser) return;
    setUsuario(storeUser);
    fetchCursosProfesor(storeUser.id);
  }, [storeUser]);

  // ==========================================
  // 5. FUNCIONES Y HANDLERS
  // ==========================================

  // Obtiene los cursos desde el backend y filtra solo los creados por este profesor
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

  // Maneja la eliminación de un curso, requiriendo confirmación previa por precaución
  const handleDeleteCurso = async (cursoId, e) => {
    e.stopPropagation(); // Evita que el click en borrar navegue hacia el detalle del curso

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
        // Actualiza el estado local para reflejar la eliminación sin recargar la página
        setCursos((prev) => prev.filter((c) => c.id !== cursoId));
      } else {
        alert("Error al eliminar el curso");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  // ==========================================
  // 6. RENDERIZADO
  // ==========================================

  if (error) return <div>{error}</div>;

  return (
    <div className="home-profesor-grid">
      {/* SECCIÓN CABECERA */}
      <div className="header-container">
        <h1>
          Bienvenido/a:{" "}
          {usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Usuario"}
        </h1>

        {/* Toggle para activar/desactivar el modo eliminación de cursos */}
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

      {/* SECCIÓN GRILLA DE CURSOS */}
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

// ==========================================
// 7. EXPORTACIONES
// ==========================================
export default HomeProfesorGrid;
