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
          className="button-delete-overlay"
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
        <img
          className="like-icon-course"
          src={LikeMarkedIcon}
          alt="Valoración"
        />{" "}
        {valoracion}
      </p>
      {/* Botón de eliminar curso de admin: siempre visible y debajo de valoración */}
      {isAdmin && (
        <button
          className="button-eliminar-curso-admin-standalone"
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
