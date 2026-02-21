// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useNavigate } from "react-router-dom";
import ImagenDefault from "../assets/individuo.png";
import { PERFILES } from "./TarjetaImagenPerfil";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// Renderiza la información resumida de cada profesor en la grilla y maneja su redirección al perfil público
function TarjetaProfesores({
  nombre,
  apellidos,
  especializacion,
  profesorId,
  imagenPerfil,
}) {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================
  const navigate = useNavigate();
  // Helpers
  const imageSrc =
    imagenPerfil && PERFILES[imagenPerfil]
      ? PERFILES[imagenPerfil]
      : ImagenDefault;

  // ==========================================
  // 4. RENDERIZADO
  // ==========================================
  return (
    <div
      className="tarjeta-profesor"
      onClick={() => navigate(`/Home/Profesores/${profesorId}`)}
    >
      <img src={imageSrc} alt="Foto profesor" />
      <h3>
        {nombre} {apellidos}
      </h3>
      <p className="p-especializacion">{especializacion}</p>
    </div>
  );
}

// ==========================================
// 5. EXPORTACIONES
// ==========================================
export default TarjetaProfesores;
