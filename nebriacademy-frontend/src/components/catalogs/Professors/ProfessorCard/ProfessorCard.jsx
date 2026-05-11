// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import DefaultIndividualIcon from "../../../../assets/Icons/individual.png";
import { PERFILES } from "../../../account/ProfileImageCard/ProfileImageCard";

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
      : DefaultIndividualIcon;

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="professor-card"
      onClick={() => navigate(`/Home/Professors/${profesorId}`)}
    >
      <img src={imageSrc} alt="Foto profesor" />
      <h3>
        {nombre} {apellidos}
      </h3>
      <p className="specialization-text">{especializacion}</p>
    </div>
  );
}

export default ProfessorCard;
