// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useNavigate } from "react-router-dom";
import familiaNebrija from "../assets/familiaNebrija.png";
import individuo from "../assets/individuo.png";
import profesor from "../assets/profesor.png";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// PreRegisterGrid: Vista intermedia que permite seleccionar el tipo de registro.
// Actúa como un enrutador visual, derivando al usuario hacia el flujo correspondiente según su rol o pertenencia a Nebrija.
function PreRegisterGrid() {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================
  const navigate = useNavigate();

  // ==========================================
  // 4. RENDERIZADO
  // ==========================================
  return (
    <div className="pre-register-grid">
      <h2>¿Eres estudiante de la familia Nebrija?</h2>

      <div className="contenedor-botones">
        {/* Flujo para estudiantes que pertenecen actualmente a la institución */}
        <button
          type="button"
          className="boton-estudiante-si"
          onClick={() => navigate("/Register/VerificacionAlumnoNebrija")}
        >
          <img src={familiaNebrija} alt="Familia Nebrija" />
          <h3>Si</h3>
          <p>Estudio actualmente en un centro asociado a Nebrija</p>
        </button>

        {/* Flujo para estudiantes externos que requieren comprobación de pago o tarjeta */}
        <button
          type="button"
          className="boton-estudiante-no"
          onClick={() => navigate("/Register/RegisterAlumnoExterno")}
        >
          <img src={individuo} alt="Individuo" />
          <h3>No</h3>
          <p>
            <b>No</b> estudio actualmente en un centro asociado a Nebrija
          </p>
        </button>
      </div>

      <div>
        {/* Flujo exclusivo para personal docente */}
        <button
          type="button"
          className="boton-profesor"
          onClick={() => navigate("/Register/VerificacionProfesor")}
        >
          <img src={profesor} alt="Profesor" />
          <p>Soy profesor</p>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 5. EXPORTACIONES
// ==========================================
export default PreRegisterGrid;
