import { useNavigate } from "react-router-dom";
import "../styles/CardSlider.css";
import { API_URL } from "../config/api";
import Foto1 from "../assets/ImagenesCursos/Foto1.jpg";
import Foto2 from "../assets/ImagenesCursos/Foto2.jpg";
import Foto3 from "../assets/ImagenesCursos/Foto3.jpg";
import Foto4 from "../assets/ImagenesCursos/Foto4.jpg";
import Foto5 from "../assets/ImagenesCursos/Foto5.jpg";
import Foto6 from "../assets/ImagenesCursos/Foto6.jpg";
import Foto7 from "../assets/ImagenesCursos/Foto7.jpg";
import Foto8 from "../assets/ImagenesCursos/Foto8.jpg";
import Foto9 from "../assets/ImagenesCursos/Foto9.jpg";
import Foto10 from "../assets/ImagenesCursos/Foto10.jpg";
import MeGusta from "../assets/me-gusta.png";
import MeGustaMarcado from "../assets/me-gusta-marcado.png";

const IMAGES_MAP = {
  Foto1,
  Foto2,
  Foto3,
  Foto4,
  Foto5,
  Foto6,
  Foto7,
  Foto8,
  Foto9,
  Foto10,
};

function CardSlider({
  type = "curso",
  cursoId,
  name,
  nivel,
  valoracion,
  imagen,
  apunte,
  likedIds = [],
  onToggleLike,
  autorNombre,
}) {
  const navigate = useNavigate();
  const imageSrc = IMAGES_MAP[imagen];
  const isLiked = apunte && likedIds.includes(apunte.id);

  if (type === "apunte") {
    return (
      <div className="card card-slider card-apunte">
        <div className="card-slider-content">
          <span className="card-apunte-label">Apunte:</span>
          <h3 className="card-apunte-title">{apunte.nombre}</h3>
          <p className="card-slider-author">{autorNombre || apunte.autor}</p>
          <button
            type="button"
            className="card-slider-category card-slider-category-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/Home/Apuntes?categoria=${encodeURIComponent(apunte.categoria)}`);
            }}
          >
            {apunte.categoria}
          </button>
          <hr />
          {apunte.descripcion && (
            <p className="card-slider-description">{apunte.descripcion}</p>
          )}
        </div>
        <div className="card-slider-footer">
          <a
            className="card-slider-file"
            href={
              apunte.archivo?.startsWith("http")
                ? apunte.archivo
                : `${API_URL}/apuntes/files/${apunte.archivo}`
            }
            target="_blank"
            rel="noreferrer"
          >
            Abrir apunte
          </a>
          <button
            type="button"
            className={`card-slider-like-button ${isLiked ? "liked" : ""}`}
            onClick={() => onToggleLike?.(apunte)}
          >
            <img src={isLiked ? MeGustaMarcado : MeGusta} alt="Like" />
            <span>{apunte.valoracion || 0}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card card-slider"
      onClick={() => navigate(`/Home/Cursos/${cursoId}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => event.key === "Enter" && navigate(`/Home/Cursos/${cursoId}`)}
    >
      <img className="card-slider-img" src={imageSrc} alt={`Imagen del curso ${name}`} />
      <div className="card-slider-content">
        <h3>{name}</h3>
        <p className="card-slider-nivel">Nivel: {nivel}</p>
        <p className="card-slider-valoracion">
          <img src={MeGustaMarcado} alt="Like" />
          <span>{valoracion || 0}</span>
        </p>
      </div>
    </div>
  );
}

export default CardSlider;
