import MeGusta from "../assets/me-gusta.png";
import MeGustaMarcado from "../assets/me-gusta-marcado.png";

function TarjetaApunte({
  apunte,
  usuario,
  likedIds = [],
  onToggleLike,
  autorNombre,
}) {
  const isLiked = likedIds.includes(apunte.id);

  return (
    <div key={apunte.id} className="item-row">
      <div className="item-main">
        <a
          href={`http://localhost:3000/apuntes/files/${apunte.archivo}`}
          target="_blank"
          rel="noreferrer"
        >
          {apunte.nombre}
        </a>
        {apunte.descripcion && <p>{apunte.descripcion}</p>}
        <p>{autorNombre || apunte.autor}</p>
      </div>

      <div className="apunte-meta">
        <div className="apunte-categoria">
          <p>{apunte.categoria}</p>
        </div>

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
    </div>
  );
}

export default TarjetaApunte;
