import { useNavigate } from "react-router-dom";

function TarjetaProfesores({ nombre, apellidos, especializacion, profesorId }) {
  const navigate = useNavigate();

    const handleProfesorClick = (profesorId) => {
        navigate(`/Home/Profesores/${profesorId}`);
    }

  return (
    <div
      className="tarjeta-profesor"
        onClick={() => handleProfesorClick(profesorId)}
    >
      <h3>{nombre} {apellidos}</h3>
      <p className="p-especializacion">{especializacion}</p>
    </div>
  );
}

export default TarjetaProfesores;