// ── IMPORTACIONES ───────────────────────────────────────────────────────────
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
import Añadirfondo from "../assets/agregar.png";
import "../styles/TarjetaFondos.css";

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
function TarjetaFondos({ selectedImage, onSelect }) {
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
        {/* Imagen personalizada */}
        {/* <div
          className="fondo-item anadir-image"
          onClick={() => onSelect("Añadirfondo")}
        >
          <img src={Añadirfondo} alt="Añadirfondo" />
        </div> */}
      </div>
    </div>
  );
}

export default TarjetaFondos;
