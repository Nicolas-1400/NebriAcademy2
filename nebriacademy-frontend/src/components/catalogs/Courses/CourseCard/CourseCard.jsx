// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import Foto1 from "../../../../assets/CourseImages/Foto1.jpg";
import Foto2 from "../../../../assets/CourseImages/Foto2.jpg";
import Foto3 from "../../../../assets/CourseImages/Foto3.jpg";
import Foto4 from "../../../../assets/CourseImages/Foto4.jpg";
import Foto5 from "../../../../assets/CourseImages/Foto5.jpg";
import Foto6 from "../../../../assets/CourseImages/Foto6.jpg";
import Foto7 from "../../../../assets/CourseImages/Foto7.jpg";
import Foto8 from "../../../../assets/CourseImages/Foto8.jpg";
import Foto9 from "../../../../assets/CourseImages/Foto9.jpg";
import Foto10 from "../../../../assets/CourseImages/Foto10.jpg";
import LikeMarkedIcon from "../../../../assets/Icons/like-marked.png";
import DeleteIcon from "../../../../assets/Icons/delete.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Tarjeta de presentación de un curso: imagen, título, categoría, nivel, descripción y valoración
function CourseCard({
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
  isAdmin,
  onAdminDelete,
}) {
  const navigate = useNavigate();

  // ── CONSTANTES ─────────────────────────────────────────────────────────────
  // Mapa para buscar la imagen por nombre tal como viene guardada en la BDD
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

  // Obtenemos la imagen del curso directamente del mapa por su nombre guardado en la BDD
  const imageSrc = IMAGES_MAP[imagen];

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="tarjeta-curso"
      onClick={() => navigate(`/Home/Courses/${cursoId}`)}
    >
      {/* Botón de eliminar: solo aparece cuando el modo borrado está activo en el padre */}
      {isDeleting && (
        <button
          onClick={onDelete}
          className="btn-delete-overlay"
          title="Eliminar curso"
        >
          <img src={DeleteIcon} alt="X" />
        </button>
      )}
      <img className="img-curso" src={imageSrc} alt="Imagen del curso" />
      <h3>{name}</h3>
      <div className="p-datos">
        <p className="p-categoria">Categoría: {categoria}</p>
        <p className="p-nivel">Nivel: {nivel}</p>
      </div>
      <p className="p-profesor">{profesor}</p>
      <p className="p-valoracion">
        <img className="like-icon-course" src={LikeMarkedIcon} alt="Valoración" /> {valoracion}
      </p>
      {/* Botón de eliminar curso de admin: siempre visible y debajo de valoración */}
      {isAdmin && (
        <button
          className="btn-eliminar-curso-admin-standalone"
          onClick={(e) => {
            e.stopPropagation();
            if (onAdminDelete) onAdminDelete();
          }}
          title="Eliminar curso"
        >
          <img src={DeleteIcon} alt="Eliminar" />
          ELIMINAR EL CURSO
        </button>
      )}
    </div>
  );
}

export default CourseCard;
