// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import photo1 from "../../../../assets/CourseImages/photo1.jpg";
import photo2 from "../../../../assets/CourseImages/photo2.jpg";
import photo3 from "../../../../assets/CourseImages/photo3.jpg";
import photo4 from "../../../../assets/CourseImages/photo4.jpg";
import photo5 from "../../../../assets/CourseImages/photo5.jpg";
import photo6 from "../../../../assets/CourseImages/photo6.jpg";
import photo7 from "../../../../assets/CourseImages/photo7.jpg";
import photo8 from "../../../../assets/CourseImages/photo8.jpg";
import photo9 from "../../../../assets/CourseImages/photo9.jpg";
import photo10 from "../../../../assets/CourseImages/photo10.jpg";
import LikeMarkedIcon from "../../../../assets/Icons/like-marked.png";
import DeleteIcon from "../../../../assets/Icons/delete.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Tarjeta compacta para renderizar cursos en grids (Home y AllCourses).
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
  // Mapeo estático de las imágenes importadas para resolver el string que viene de la API
  const IMAGES_MAP = {
    photo1,
    photo2,
    photo3,
    photo4,
    photo5,
    photo6,
    photo7,
    photo8,
    photo9,
    photo10,
  };

  const imageSrc = IMAGES_MAP[imagen];

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="course-card"
      onClick={() => navigate(`/Home/Courses/${cursoId}`)}
    >
      {/* Botón de borrado overlay: visible si se activa modo de borrado en el componente padre */}
      {isDeleting && (
        <button
          onClick={onDelete}
          className="button-delete-overlay"
          title="Eliminar curso"
        >
          <img src={DeleteIcon} alt="X" />
        </button>
      )}

      <img className="course-image" src={imageSrc} alt="Imagen del curso" />
      <h3>{name}</h3>
      <div className="data-info">
        <p className="data-category">Categoría: {categoria}</p>
        <p className="data-level">Nivel: {nivel}</p>
      </div>
      <p className="data-professor">{profesor}</p>
      <p className="data-rating">
        <img
          className="like-icon-course"
          src={LikeMarkedIcon}
          alt="Valoración"
        />{" "}
        {valoracion}
      </p>

      {/* Botón de borrado admin: visible explícitamente para administradores en todo momento */}
      {isAdmin && (
        <button
          className="admin-delete-course-btn"
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
