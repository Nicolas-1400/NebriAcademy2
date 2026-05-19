// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import PencilIcon from "../../../../assets/Icons/pencil.png";
import DeleteIcon from "../../../../assets/Icons/delete.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Tarjeta individual que renderiza un ejercicio dentro del temario de un curso.
function CourseExerciseCard({
  ejercicio,
  tipo,
  editingMode,
  handleEditNavigate,
  handleDeleteContenido,
}) {
  // Lógica de permisos: edición solo para el profesor creador; borrado para profesor y admin.
  const isProfesorEdit = tipo === "profesor" && editingMode;
  const showDelete = isProfesorEdit || tipo === "administrador";

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <li key={ejercicio.id} className="item-row">
      <div className="item-main">
        {/* Enlace directo para descargar o visualizar el enunciado del ejercicio */}
        <a href={ejercicio.archivo} target="_blank" rel="noreferrer">
          {ejercicio.nombre}
        </a>
        {ejercicio.descripcion && <p>{ejercicio.descripcion}</p>}
      </div>

      {/* Panel de botones de administración (editar/borrar) renderizado condicionalmente */}
      {(isProfesorEdit || showDelete) && (
        <div className="edit-controls">
          {isProfesorEdit && (
            <button
              onClick={() => handleEditNavigate("ejercicio", ejercicio)}
              title="Editar ejercicio"
            >
              <img src={PencilIcon} alt="Editar" />
            </button>
          )}
          {showDelete && (
            <button
              onClick={() => handleDeleteContenido("ejercicio", ejercicio.id)}
              title="Borrar ejercicio"
            >
              <img src={DeleteIcon} alt="Borrar ejercicio" />
            </button>
          )}
        </div>
      )}
    </li>
  );
}

export default CourseExerciseCard;
