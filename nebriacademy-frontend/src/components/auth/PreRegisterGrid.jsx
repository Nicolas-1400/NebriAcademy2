// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import familiaNebrija from "../../assets/Iconos/familiaNebrija.png";
import individuo from "../../assets/Iconos/individuo.png";
import profesor from "../../assets/Iconos/profesor.png";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Pantalla previa al registro: el usuario elige si es alumno Nebrija, alumno externo o profesor
function PreRegisterGrid() {
  const navigate = useNavigate();

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="pre-register-grid">
      <h2>¿Eres estudiante de la familia Nebrija?</h2>

      <div className="contenedor-botones">
        <button
          type="button"
          className="boton-estudiante-si"
          onClick={() => navigate("/Register/Verificacion/alumnonebrija")}
        >
          <img src={familiaNebrija} alt="Familia Nebrija" />
          <h3>Si</h3>
          <p>Estudio actualmente en un centro asociado a Nebrija</p>
        </button>

        <button
          type="button"
          className="boton-estudiante-no"
          onClick={() => navigate("/Register/alumnoexterno")}
        >
          <img src={individuo} alt="Individuo" />
          <h3>No</h3>
          <p>
            <b>No</b> estudio actualmente en un centro asociado a Nebrija
          </p>
        </button>
      </div>

      <div>
        <button
          type="button"
          className="boton-profesor"
          onClick={() => navigate("/Register/Verificacion/profesor")}
        >
          <img src={profesor} alt="Profesor" />
          <p>Soy profesor</p>
        </button>
      </div>
    </div>
  );
}

export default PreRegisterGrid;
