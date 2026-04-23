// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Editar from "../assets/lapiz.png";
import Eliminar from "../assets/Eliminar.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Tarjeta que muestra un vídeo dentro de la vista de un curso.
// Si el usuario es profesor y está en modo edición, muestra botones de editar y borrar.
function TarjetaVideoCurso({
  video,
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
    <div key={video.id} className="video-item">
      <div>
        <h5>{video.nombre}</h5>
      </div>

      <video controls>
        <source src={video.archivo} type="video/mp4" />
        Tu navegador no soporta el elemento <code>video</code>.
      </video>

      {/* Controles de edición: editar solo profesor, borrar profesor/admin */}
      {(isProfesorEdit || showDelete) && (
        <div className="edit-controls">
          {isProfesorEdit && (
            <button
              onClick={() => handleEditNavigate("video", video)}
              title="Editar vídeo"
            >
              <img src={Editar} alt="Editar" />
            </button>
          )}
          {showDelete && (
            <button
              onClick={() => handleDeleteContenido("video", video.id)}
              title="Borrar vídeo"
            >
              <img src={Eliminar} alt="Borrar vídeo" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default TarjetaVideoCurso;
