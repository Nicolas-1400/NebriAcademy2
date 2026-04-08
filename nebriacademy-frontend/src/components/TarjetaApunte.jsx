// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../config/api";
import MeGusta from "../assets/me-gusta.png";
import MeGustaMarcado from "../assets/me-gusta-marcado.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Tarjeta que muestra un apunte individual en la página global de Apuntes
function TarjetaApunte({
  apunte,
  usuario,
  likedIds = [],
  onToggleLike,
  autorNombre,
}) {
  // Determinamos si el usuario ya ha dado like a este apunte
  const isLiked = likedIds.includes(apunte.id);

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div key={apunte.id} className="item-row">
      <div className="item-main">
        {/* El nombre del apunte abre directamente el archivo en una nueva pestaña */}
        <a
          href={`${API_URL}/apuntes/files/${apunte.archivo}`}
          target="_blank"
          rel="noreferrer"
        >
          {apunte.nombre}
        </a>
        {apunte.descripcion && <p>{apunte.descripcion}</p>}
        {/* Mostramos el nombre del autor si viene resuelto; si no, mostramos el ID */}
        <p>{autorNombre || apunte.autor}</p>
      </div>

      <div className="apunte-meta">
        <div className="apunte-categoria">
          <p>{apunte.categoria}</p>
        </div>

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
    </div>
  );
}

export default TarjetaApunte;
