import { useNavigate } from "react-router-dom"

function TarjetaCursos({ name, cursoId, categoria, descripcion, profesor, valoracion }) {

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
        <p>Categoría: {categoria}</p>
        <p>{descripcion}</p>
        <p>{profesor}</p>
        <p>Valoración: {valoracion}</p>
    </div>
  )
}

export default TarjetaCursos