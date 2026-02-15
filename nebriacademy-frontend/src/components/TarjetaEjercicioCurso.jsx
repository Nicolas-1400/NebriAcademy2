import Editar from "../assets/lapiz.png";

/**
 * Componente: TarjetaEjercicioCurso
 * Item de lista para un ejercicio dentro de un curso.
 * Incluye controles de edición para profesores.
 */
function TarjetaEjercicioCurso({
  ejercicio,
  tipo,
  editingMode,
  handleEditNavigate,
  handleDeleteContenido,
}) {
  const isProfesorEdit = tipo === "profesor" && editingMode;

  return (
    <li key={ejercicio.id} className="item-row">
      <div className="item-main">
        <a
          href={`http://localhost:3000/ejercicios/files/${ejercicio.archivo}`}
          target="_blank"
          rel="noreferrer"
        >
          {ejercicio.nombre}
        </a>
        {ejercicio.descripcion && <p>{ejercicio.descripcion}</p>}
      </div>

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
            ✖
          </button>
        </div>
      )}
    </li>
  );
}

export default TarjetaEjercicioCurso;
