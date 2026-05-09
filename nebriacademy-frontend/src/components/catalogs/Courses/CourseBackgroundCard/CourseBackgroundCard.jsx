// ── IMPORTACIONES ───────────────────────────────────────────────────────────
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

// ── CONSTANTES ─────────────────────────────────────────────────────────────
// Mapa de nombre → objeto de imagen importado por Vite
const IMAGES = {
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

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Componente que muestra una galería de imágenes de fondo para que el usuarios elija la portada del curso
function CourseBackgroundCard({ selectedImage, onSelect }) {
  const imageKeys = [
    "photo1",
    "photo2",
    "photo3",
    "photo4",
    "photo5",
    "photo6",
    "photo7",
    "photo8",
    "photo9",
    "photo10",
  ];

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="tarjeta-fondos-container">
      <h4>Selecciona una imagen de fondo</h4>
      <div className="fondos-grid">
        {imageKeys.map((key) => (
          <div
            key={key}
            // La imagen seleccionada recibe la clase "selected" para resaltarse visualmente
            className={`fondo-item ${selectedImage === key ? "selected" : ""}`}
            onClick={() => onSelect(key)}
          >
            <img src={IMAGES[key]} alt={key} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseBackgroundCard;
