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

const IMAGES = [
  Foto10,
  Foto1,
  Foto2,
  Foto3,
  Foto4,
  Foto5,
  Foto6,
  Foto7,
  Foto8,
  Foto9,
];

/**
 * Componente: TarjetaCursos
 * Tarjeta principal de curso para listados.
 * Muestra información completa (imagen, profesor, categoría, etc.).
 */
function TarjetaCursos({
  name,
  cursoId,
  categoria,
  nivel,
  descripcion,
  profesor,
  valoracion,
}) {
  const navigate = useNavigate();
  const imageSrc = IMAGES[cursoId % 10]; // Selección de imagen determinista

  return (
    <div
      className="tarjeta-curso"
      onClick={() => navigate(`/Home/Cursos/${cursoId}`)}
    >
      <img src={imageSrc} alt="Imagen del curso" />
      <h3>{name}</h3>
      <p className="p-categoria">Categoría: {categoria}</p>
      <p className="p-nivel">Nivel: {nivel}</p>
      <p className="p-descripcion">{descripcion}</p>
      <p className="p-profesor">{profesor}</p>
      <p className="p-valoracion">Valoración: {valoracion}</p>
    </div>
  );
}

export default TarjetaCursos;
