// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import NebrijaFamilyIcon from "../../../assets/Icons/nebrijaFamily.png";
import IndividualIcon from "../../../assets/Icons/individual.png";
import ProfessorIcon from "../../../assets/Icons/professor.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Pantalla previa al registro: el usuario elige si es alumno Nebrija, alumno externo o profesor
function PreRegisterGrid() {
  const navigate = useNavigate();

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="pre-register-grid">
      <h2>¿Eres estudiante de la familia Nebrija?</h2>

      <div className="buttons-container">
        <button
          type="button"
          className="student-yes-button"
          onClick={() => navigate("/Register/Verification/alumnonebrija")}
        >
          <img src={NebrijaFamilyIcon} alt="Familia Nebrija" />
          <h3>Si</h3>
          <p>Estudio actualmente en un centro asociado a Nebrija</p>
        </button>

        <button
          type="button"
          className="student-no-button"
          onClick={() => navigate("/Register/alumnoexterno")}
        >
          <img src={IndividualIcon} alt="Individuo" />
          <h3>No</h3>
          <p>
            <b>No</b> estudio actualmente en un centro asociado a Nebrija
          </p>
        </button>
      </div>

      <div>
        <button
          type="button"
          className="professor-button"
          onClick={() => navigate("/Register/Verification/profesor")}
        >
          <img src={ProfessorIcon} alt="Profesor" />
          <p>Soy profesor</p>
        </button>
      </div>
    </div>
  );
}

export default PreRegisterGrid;
