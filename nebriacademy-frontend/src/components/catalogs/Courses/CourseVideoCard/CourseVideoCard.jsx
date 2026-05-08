import { useState } from "react";
import PencilIcon from "../../../../assets/Icons/pencil.png";
import DeleteIcon from "../../../../assets/Icons/delete.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Tarjeta que muestra un vídeo dentro de la vista de un curso.
// Si el usuario es profesor y está en modo edición, muestra botones de editar y borrar.
function CourseVideoCard({
  video,
  tipo,
  editingMode,
  handleEditNavigate,
  handleDeleteContenido,
}) {
  const [expanded, setExpanded] = useState(false);
  const isProfesorEdit = tipo === "profesor" && editingMode;
  const showDelete = isProfesorEdit || tipo === "administrador";

  return (
    <div key={video.id} className={`video-item ${expanded ? "expanded" : ""}`}>
      <div className="video-item-header" onClick={() => setExpanded(!expanded)}>
        <div className="video-title-group">
          <span className={`arrow-toggle ${expanded ? "active" : ""}`}>▶</span>
          <h5>{video.nombre}</h5>
        </div>

        {/* Controles de edición: editar solo profesor, borrar profesor/admin */}
        {(isProfesorEdit || showDelete) && (
          <div className="edit-controls" onClick={(e) => e.stopPropagation()}>
            {isProfesorEdit && (
              <button
                onClick={() => handleEditNavigate("video", video)}
                title="Editar vídeo"
              >
                <img src={PencilIcon} alt="Editar" />
              </button>
            )}
            {showDelete && (
              <button
                onClick={() => handleDeleteContenido("video", video.id)}
                title="Borrar vídeo"
              >
                <img src={DeleteIcon} alt="Borrar vídeo" />
              </button>
            )}
          </div>
        )}
      </div>

      {expanded && (
        <div className="video-player-container">
          <video controls autoPlay>
            <source src={video.archivo} type="video/mp4" />
            Tu navegador no soporta el elemento <code>video</code>.
          </video>
        </div>
      )}
    </div>
  );
}

export default CourseVideoCard;
