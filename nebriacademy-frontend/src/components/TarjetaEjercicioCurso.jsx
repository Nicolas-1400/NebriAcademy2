// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Editar from "../assets/lapiz.png";
import Eliminar from "../assets/Eliminar.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Tarjeta que muestra un ejercicio dentro de la vista de un curso.
// Si el usuario es profesor y está en modo edición, muestra botones de editar y borrar.
function TarjetaEjercicioCurso({
  ejercicio,
  tipo,
  editingMode,
  handleEditNavigate,
  handleDeleteContenido,
}) {
  // Los botones de edición solo son visibles si el usuario es profesor y el modo edición está activo
  const isProfesorEdit = tipo === "profesor" && editingMode;

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <li key={ejercicio.id} className="item-row">
      <div className="item-main">
        {/* El nombre del ejercicio abre directamente el archivo en una nueva pestaña */}
        <a
          href={`http://localhost:3000/ejercicios/files/${ejercicio.archivo}`}
          target="_blank"
          rel="noreferrer"
        >
          {ejercicio.nombre}
        </a>
        {ejercicio.descripcion && <p>{ejercicio.descripcion}</p>}
      </div>

      {/* Controles de edición: solo visibles para el profesor en modo edición */}
      {isProfesorEdit && (
        <div className="edit-controls">
          <button
            onClick={() => handleEditNavigate("ejercicio", ejercicio)}
            title="Editar ejercicio"
          >
            <img src={Editar} alt="Editar" />
          </button>
          <button
            onClick={() => handleDeleteContenido("ejercicio", ejercicio.id)}
            title="Borrar ejercicio"
          >
            <img src={Eliminar} alt="Borrar ejercicio" />
          </button>
        </div>
      )}
    </li>
  );
}

export default TarjetaEjercicioCurso;
