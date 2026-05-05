// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Editar from "../../../assets/Iconos/lapiz.png";
import Eliminar from "../../../assets/Iconos/Eliminar.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Tarjeta que muestra un ejercicio dentro de la vista de un curso.
// Si el usuario es profesor y está en modo edición, muestra botones de editar y borrar.
function CourseExerciseCard({
  ejercicio,
  tipo,
  editingMode,
  handleEditNavigate,
  handleDeleteContenido,
}) {
  // Los botones de edición solo son visibles si el usuario es profesor y el modo edición está activo
  const isProfesorEdit = tipo === "profesor" && editingMode;
  const showDelete = isProfesorEdit || tipo === "administrador";

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <li key={ejercicio.id} className="item-row">
      <div className="item-main">
        <a href={ejercicio.archivo} target="_blank" rel="noreferrer">
          {ejercicio.nombre}
        </a>
        {ejercicio.descripcion && <p>{ejercicio.descripcion}</p>}
      </div>

      {/* Controles de edición: editar solo profesor, borrar profesor/admin */}
      {(isProfesorEdit || showDelete) && (
        <div className="edit-controls">
          {isProfesorEdit && (
            <button
              onClick={() => handleEditNavigate("ejercicio", ejercicio)}
              title="Editar ejercicio"
            >
              <img src={Editar} alt="Editar" />
            </button>
          )}
          {showDelete && (
            <button
              onClick={() => handleDeleteContenido("ejercicio", ejercicio.id)}
              title="Borrar ejercicio"
            >
              <img src={Eliminar} alt="Borrar ejercicio" />
            </button>
          )}
        </div>
      )}
    </li>
  );
}

export default CourseExerciseCard;
