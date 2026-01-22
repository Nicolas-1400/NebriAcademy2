import { useNavigate } from 'react-router-dom'
import familiaNebrija from "../assets/familiaNebrija.png";
import individuo from "../assets/individuo.png";
import profesor from "../assets/profesor.png";

function PreRegisterGrid() {

  const navigate = useNavigate();

  const clickSi = () => {
    navigate('/Register/VerificacionAlumnoNebrija');
  };
  const clickNo = () => {
    navigate('/Register/RegisterAlumnoExterno');
  };
  const clickProf = () => {
    navigate('/Register/RegisterProfesor');
  };

  return (
    <div className="pre-register-grid">
      <h2>¿Eres estudiante de la familia Nebrija?</h2>
      <div className="contenedor-botones">
        <button type="button" className="boton-estudiante-si" onClick={clickSi}>
          <img src={familiaNebrija} alt="Familia Nebrija" />
          <h3>Si</h3>
          <p>Estudio actualmente en un centro asociado a Nebrija</p>
        </button>
        <button type="button" className="boton-estudiante-no" onClick={clickNo}>

          <img src={individuo} alt="Individuo" />
          <h3>No</h3>
          <p><b>No</b> estudio actualmente en un centro asociado a Nebrija</p>
        </button>
      </div>
      <div>
        <button type="button" className="boton-profesor" onClick={clickProf}>
          <img src={profesor} alt="Profesor" />
          <p>Soy profesor</p>
        </button>
      </div>
    </div>
  );
}

export default PreRegisterGrid;
