// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useState } from "react";
import PencilIcon from "../../../../assets/Icons/pencil.png";
import DeleteIcon from "../../../../assets/Icons/delete.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Tarjeta desplegable que incrusta un vídeo del curso con reproductor nativo.
function CourseVideoCard({
  video,
  tipo,
  editingMode,
  handleEditNavigate,
  handleDeleteContenido,
}) {
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const [expanded, setExpanded] = useState(false);

  // Lógica de permisos para los botones de edición y borrado
  const isProfesorEdit = tipo === "profesor" && editingMode;
  const showDelete = isProfesorEdit || tipo === "administrador";

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div key={video.id} className={`video-item ${expanded ? "expanded" : ""}`}>
      {/* Cabecera clickeable para desplegar/contraer el reproductor */}
      <div className="video-item-header" onClick={() => setExpanded(!expanded)}>
        <div className="video-title-group">
          <span className={`arrow-toggle ${expanded ? "active" : ""}`}>▶</span>
          <h5>{video.nombre}</h5>
        </div>

        {/* Controles flotantes de administración del vídeo */}
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

      {/* Reproductor de vídeo nativo HTML5 renderizado de forma condicional */}
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
