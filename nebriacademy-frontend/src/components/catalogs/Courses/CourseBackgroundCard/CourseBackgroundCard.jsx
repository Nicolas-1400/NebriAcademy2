// ── IMPORTACIONES ───────────────────────────────────────────────────────────
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

// ── CONSTANTES ─────────────────────────────────────────────────────────────
// Mapa de nombre → objeto de imagen importado por Vite
const IMAGES = {
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
// Componente que muestra una galería de imágenes de fondo para que el usuarios elija la portada del curso
function CourseBackgroundCard({ selectedImage, onSelect }) {
  const imageKeys = [
    "Foto1",
    "Foto2",
    "Foto3",
    "Foto4",
    "Foto5",
    "Foto6",
    "Foto7",
    "Foto8",
    "Foto9",
    "Foto10",
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
