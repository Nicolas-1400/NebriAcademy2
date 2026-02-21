// ==========================================
// 1. IMPORTACIONES
// ==========================================
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
import "../styles/TarjetaFondos.css";

// ==========================================
// 2. CONSTANTES GLOBALES
// ==========================================
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

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================
function TarjetaFondos({ selectedImage, onSelect }) {
  // ==========================================
  // 4. ESTADOS Y VARIABLES
  // ==========================================
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

  // ==========================================
  // 5. RENDERIZADO
  // ==========================================
  return (
    <div className="tarjeta-fondos-container">
      <h4>Selecciona una imagen de fondo</h4>
      <div className="fondos-grid">
        {imageKeys.map((key) => (
          <div
            key={key}
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

// ==========================================
// 6. EXPORTACIONES
// ==========================================
export default TarjetaFondos;
