// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import ImagenDefault from "../../../assets/Iconos/individuo.png";
import { PERFILES } from "../../account/ProfileImageCard";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Tarjeta que muestra la información básica de un profesor en la lista de todos los profesores
function ProfessorCard({
  nombre,
  apellidos,
  especializacion,
  profesorId,
  imagenPerfil,
}) {
  const navigate = useNavigate();
  // Si el profesor tiene imagen de perfil asignada y existe en el mapa, la usamos; si no, imagen por defecto
  const imageSrc =
    imagenPerfil && PERFILES[imagenPerfil]
      ? PERFILES[imagenPerfil]
      : ImagenDefault;

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="tarjeta-profesor"
      onClick={() => navigate(`/Home/Professors/${profesorId}`)}
    >
      <img src={imageSrc} alt="Foto profesor" />
      <h3>
        {nombre} {apellidos}
      </h3>
      <p className="p-especializacion">{especializacion}</p>
    </div>
  );
}

export default ProfessorCard;


