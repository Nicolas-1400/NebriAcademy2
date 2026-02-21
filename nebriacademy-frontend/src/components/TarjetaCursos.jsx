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
import Eliminar from "../assets/Eliminar.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Tarjeta de presentación de un curso: imagen, título, categoría, nivel, descripción y valoración
function TarjetaCursos({
  name,
  cursoId,
  categoria,
  nivel,
  descripcion,
  profesor,
  valoracion,
  imagen,
  isDeleting,
  onDelete,
}) {
  const navigate = useNavigate();

  // ── CONSTANTES ─────────────────────────────────────────────────────────────
  // Mapa para buscar la imagen por nombre tal como viene guardada en la BD
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

  // Obtenemos la imagen del curso directamente del mapa por su nombre guardado en la BD
  const imageSrc = IMAGES_MAP[imagen];

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="tarjeta-curso"
      onClick={() => navigate(`/Home/Cursos/${cursoId}`)}
    >
      {/* Botón de eliminar: solo aparece cuando el modo borrado está activo en el padre */}
      {isDeleting && (
        <button
          onClick={onDelete}
          className="btn-delete-overlay"
          title="Eliminar curso"
        >
          <img src={Eliminar} alt="X" />
        </button>
      )}
      <img className="img-curso" src={imageSrc} alt="Imagen del curso" />
      <h3>{name}</h3>
      <div className="p-datos">
        <p className="p-categoria">Categoría: {categoria}</p>
        <p className="p-nivel">Nivel: {nivel}</p>
        <p className="p-descripcion">{descripcion}</p>
      </div>
      <p className="p-profesor">{profesor}</p>
      <p className="p-valoracion">
        <img src={Like} alt="Valoración" /> {valoracion}
      </p>
    </div>
  );
}

export default TarjetaCursos;
