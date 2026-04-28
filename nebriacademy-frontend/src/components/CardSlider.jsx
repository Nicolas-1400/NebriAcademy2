import { useNavigate } from "react-router-dom";
import "../styles/CardSlider.css";
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
import Like from "../assets/me-gusta-marcado.png";

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

function CardSlider({ name, cursoId, nivel, valoracion, imagen }) {
  const navigate = useNavigate();
  const imageSrc = IMAGES_MAP[imagen];

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
          <img src={Like} alt="Like" />
          <span>{valoracion || 0}</span>
        </p>
      </div>
    </div>
  );
}

export default CardSlider;
