// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import MeGusta from "../assets/Iconos/me-gusta.png";
import MeGustaMarcado from "../assets/Iconos/me-gusta-marcado.png";
import Editar from "../assets/Iconos/lapiz.png";
import Eliminar from "../assets/Iconos/Eliminar.png";


// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Tarjeta que muestra un apunte dentro de la vista de un curso concreto.
// Si el usuario es profesor y está en modo edición, muestra botones de editar y borrar.
function TarjetaApunteCurso({
  apunte,
  usuario,
  likedIds = [],
  onToggleLike,
  tipo,
  editingMode,
  handleEditNavigate,
  handleDeleteContenido,
  allowEdit = true,
}) {
  const isLiked = likedIds.includes(apunte.id);
  // El botón de editar se muestra si es profesor en modo edición y se permite editar (apuntes propios)
  const showEdit = tipo === "profesor" && editingMode && allowEdit;
  // El botón de borrar se muestra si es profesor en modo edición o si es admin
  const showDelete = (tipo === "profesor" && editingMode) || tipo === "administrador";

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div key={apunte.id} className="item-row">
      <div className="item-main">
        <a href={apunte.archivo} target="_blank" rel="noreferrer">
          {apunte.nombre || apunte.archivo}
        </a>
        {apunte.descripcion && <p>{apunte.descripcion}</p>}
        <p className="apunte-autor">{apunte.nombreAutor || apunte.autor}</p>
      </div>

      {/* Controles de edición: editar solo profesor si está permitido, borrar profesor/admin */}
      {(showEdit || showDelete) && (
        <div className="edit-controls">
          {showEdit && (
            <button
              onClick={() => handleEditNavigate("apunte", apunte)}
              title="Editar apunte"
            >
              <img src={Editar} alt="Editar" />
            </button>
          )}
          {showDelete && (
            <button
              onClick={() => handleDeleteContenido("apunte", apunte.id)}
              title="Borrar apunte"
            >
              <img src={Eliminar} alt="Borrar apunte" />
            </button>
          )}
        </div>
      )}

      <div className="apunte-like">
        {/* El botón de like solo aparece si el componente padre ha pasado la función onToggleLike */}
        {onToggleLike && usuario?.id && (
          <>
            <img
              src={isLiked ? MeGustaMarcado : MeGusta}
              alt="like"
              className={`like-icon ${isLiked ? "liked" : ""}`}
              onClick={() => onToggleLike(apunte)}
            />
            <span className="like-count">{apunte.valoracion || 0}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default TarjetaApunteCurso;
