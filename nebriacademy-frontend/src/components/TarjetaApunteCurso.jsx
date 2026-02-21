// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import MeGusta from "../assets/me-gusta.png";
import MeGustaMarcado from "../assets/me-gusta-marcado.png";
import Editar from "../assets/lapiz.png";
import Eliminar from "../assets/Eliminar.png";

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
}) {
  const isLiked = likedIds.includes(apunte.id);
  // Los botones de edición solo son visibles si el usuario es profesor y el modo edición está activo
  const isProfesorEdit = tipo === "profesor" && editingMode;

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div key={apunte.id} className="item-row">
      <div className="item-main">
        {/* El nombre del apunte abre directamente el archivo en una nueva pestaña */}
        <a
          href={`http://localhost:3000/apuntes/files/${apunte.archivo}`}
          target="_blank"
          rel="noreferrer"
        >
          {apunte.nombre || apunte.archivo}
        </a>
        {apunte.descripcion && <p>{apunte.descripcion}</p>}
        <p className="apunte-autor">{apunte.nombreAutor || apunte.autor}</p>
      </div>

      {/* Controles de edición: solo visibles para el profesor en modo edición */}
      {isProfesorEdit && (
        <div className="edit-controls">
          <button
            onClick={() => handleEditNavigate("apunte", apunte)}
            title="Editar apunte"
          >
            <img src={Editar} alt="Editar" />
          </button>
          <button
            onClick={() => handleDeleteContenido("apunte", apunte.id)}
            title="Borrar apunte"
          >
            <img src={Eliminar} alt="Borrar apunte" />
          </button>
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
