// ==========================================
// 1. IMPORTACIONES
// ==========================================
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

// ==========================================
// 2. CONSTANTES GLOBALES
// ==========================================
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

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================
function TarjetaCursoPequena({ name, cursoId, nivel, valoracion, imagen }) {
  // ==========================================
  // 4. ESTADOS Y HOOKS
  // ==========================================
  const navigate = useNavigate();

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

  // ==========================================
  // 5. FUNCIONES Y HANDLERS
  // ==========================================
  // Obtiene la imagen del curso o asigna una por defecto según el ID
  const getCourseImage = () => {
    if (imagen && IMAGES_MAP[imagen]) return IMAGES_MAP[imagen];
    return IMAGES[cursoId % 10];
  };

  const imageSrc = getCourseImage();

  // ==========================================
  // 6. RENDERIZADO
  // ==========================================
  return (
    <div
      className="tarjeta-curso-pequena"
      onClick={() => navigate(`/Home/Cursos/${cursoId}`)}
    >
      <img src={imageSrc} alt="Imagen del curso" />
      <h3>{name}</h3>
      <p className="p-nivel">Nivel: {nivel}</p>
      <p className="p-valoracion">
        {" "}
        <img src={Like} alt="Valoración" /> {valoracion}
      </p>
    </div>
  );
}

// ==========================================
// 7. EXPORTACIONES
// ==========================================
export default TarjetaCursoPequena;
