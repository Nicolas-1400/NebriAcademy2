import MeGusta from "../assets/me-gusta.png";
import MeGustaMarcado from "../assets/me-gusta-marcado.png";
import Editar from "../assets/lapiz.png";
import Eliminar from "../assets/Eliminar.png";

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
  const isProfesorEdit = tipo === "profesor" && editingMode;

  return (
    <div key={apunte.id} className="item-row">
      <div className="item-main">
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

      {/* Controles de Profesor */}
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

      {/* Sección de Likes */}
      <div className="apunte-like">
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
