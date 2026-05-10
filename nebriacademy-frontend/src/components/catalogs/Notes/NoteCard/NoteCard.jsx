// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import LikeIcon from "../../../../assets/Icons/like.png";
import LikeMarkedIcon from "../../../../assets/Icons/like-marked.png";
import PencilIcon from "../../../../assets/Icons/pencil.png";
import DeleteIcon from "../../../../assets/Icons/delete.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Tarjeta unificada para mostrar un apunte tanto en la lista global de Apuntes
// como dentro de la vista de un curso concreto.
//
// Props opcionales para el contexto de curso (editingMode, handleEditNavigate, etc.):
// si no se pasan, la tarjeta se comporta como la versión simple de la lista global.
//
// Props opcionales para la vista global (autorNombre, categoria):
// si no se pasan, la tarjeta no muestra categoría ni resuelve el nombre externamente.
function NoteCard({
  apunte,
  usuario,
  likedIds = [],
  onToggleLike,
  // Vista global: nombre del autor ya resuelto por el padre
  autorNombre,
  // Vista de curso: rol del usuario y controles de edición
  tipo,
  editingMode = false,
  handleEditNavigate,
  handleDeleteContenido,
  allowEdit = true,
}) {
  const isLiked = likedIds.includes(apunte.id);

  // Los botones de edición solo aparecen en el contexto de curso (cuando se pasa tipo)
  const showEdit = tipo === "profesor" && editingMode && allowEdit;
  const showDelete =
    (tipo === "profesor" && editingMode) || tipo === "administrador";

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div key={apunte.id} className="item-row">
      <div className="item-main">
        <a href={apunte.archivo} target="_blank" rel="noreferrer">
          {apunte.nombre || apunte.archivo}
        </a>
        {apunte.descripcion && <p>{apunte.descripcion}</p>}
        {/* El nombre del autor puede venir ya resuelto (vista global) o en el propio objeto (vista curso) */}
        <p className="apunte-autor">
          {autorNombre || apunte.nombreAutor || apunte.autor}
        </p>
      </div>

      {/* Sección derecha: controles de edición + categoría + like */}
      <div className="right-section-notes">
        {/* Categoría: solo se muestra en la vista global cuando viene el dato */}
        {apunte.categoria && (
          <div className="note-category">
            <p>{apunte.categoria}</p>
          </div>
        )}

        {/* Controles de edición: editar solo profesor si está permitido, borrar profesor/admin */}
        {(showEdit || showDelete) && (
          <div className="edit-controls">
            {showEdit && (
              <button
                onClick={() => handleEditNavigate("apunte", apunte)}
                title="Editar apunte"
              >
                <img src={PencilIcon} alt="Editar" />
              </button>
            )}
            {showDelete && (
              <button
                onClick={() => handleDeleteContenido("apunte", apunte.id)}
                title="Borrar apunte"
              >
                <img src={DeleteIcon} alt="Borrar apunte" />
              </button>
            )}
          </div>
        )}

        {/* Like: se muestra si el padre pasa la función onToggleLike y hay usuario logueado */}
        {onToggleLike && usuario?.id && (
          <div className="note-like">
            <img
              src={isLiked ? LikeMarkedIcon : LikeIcon}
              alt="like"
              className={`like-icon ${isLiked ? "liked" : ""}`}
              onClick={() => onToggleLike(apunte)}
            />
            <span className="like-count">{apunte.valoracion || 0}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default NoteCard;
