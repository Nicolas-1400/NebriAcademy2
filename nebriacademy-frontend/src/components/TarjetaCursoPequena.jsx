// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
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

// ── CONSTANTES ─────────────────────────────────────────────────────────────
// Mapa de nombre → imagen importada para resolver la portada del curso
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

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Versión compacta de la tarjeta de curso: se usa en los carruseles del HomeFeed y en Mi Espacio
function TarjetaCursoPequena({ name, cursoId, nivel, valoracion, imagen }) {
  const navigate = useNavigate();

  // Obtenemos la imagen directamente del mapa por el nombre guardado en la BDD
  const imageSrc = IMAGES_MAP[imagen];

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="tarjeta-curso-pequena"
      onClick={() => navigate(`/Home/Cursos/${cursoId}`)}
    >
      <img className="img-curso" src={imageSrc} alt="Imagen del curso" />
      <h3>{name}</h3>
      <p className="p-nivel">Nivel: {nivel}</p>
      <p className="p-valoracion">
        {" "}
        <img src={Like} alt="Valoración" /> {valoracion}
      </p>
    </div>
  );
}

export default TarjetaCursoPequena;
