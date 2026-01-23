import { useNavigate } from "react-router-dom"

function TarjetaCursos(name, cursoId, description) {

    const navigate = useNavigate();

    const handleCursoClick = (cursoId) => {
        navigate(`/Home/Cursos/${cursoId}`);
    }

  return (
    <div
        className="tarjeta-curso"
        onClick={() => handleCursoClick(cursoId)}
    >
        <h3>{name}</h3>
        <p>{description}</p>
        
    </div>
  )
}

export default TarjetaCursos