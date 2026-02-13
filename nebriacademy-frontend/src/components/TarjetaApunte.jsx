import MeGusta from "../assets/me-gusta.png";
import MeGustaMarcado from "../assets/me-gusta-marcado.png";

function TarjetaApunte({ apunte, usuario, likedIds = [], onToggleLike, autorNombre }) {
  const isLiked = likedIds.includes(apunte.id);
  return (
    <li key={apunte.id} className="item-row">
      <div className="item-main">
        <a href={`http://localhost:3000/apuntes/files/${apunte.archivo}`} target="_blank" rel="noreferrer">{apunte.nombre}</a>
        {apunte.descripcion ? <p>{apunte.descripcion}</p> : null}
        <p>{autorNombre || apunte.autor}</p>
      </div>
      <div className="apunte-meta">
        <div className="apunte-categoria">
          <p>{apunte.categoria}</p>
        </div>
        <div className="apunte-like">
          {onToggleLike && usuario && usuario.id ? (
            <>
              <img src={isLiked ? MeGustaMarcado : MeGusta} alt="like" className={isLiked ? 'like-icon liked' : 'like-icon'} onClick={() => onToggleLike(apunte)} />
              <span className="like-count">{apunte.valoracion || 0}</span>
            </>
          ) : null}
        </div>
      </div>
    </li>
  )
}

export default TarjetaApunte;
