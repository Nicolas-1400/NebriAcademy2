import { useNavigate } from "react-router-dom"
import Foto1 from "../assets/ImagenesCursos/Foto1.jpg"
import Foto2 from "../assets/ImagenesCursos/Foto2.jpg"
import Foto3 from "../assets/ImagenesCursos/Foto3.jpg"
import Foto4 from "../assets/ImagenesCursos/Foto4.jpg"
import Foto5 from "../assets/ImagenesCursos/Foto5.jpg"
import Foto6 from "../assets/ImagenesCursos/Foto6.jpg"
import Foto7 from "../assets/ImagenesCursos/Foto7.jpg"
import Foto8 from "../assets/ImagenesCursos/Foto8.jpg"
import Foto9 from "../assets/ImagenesCursos/Foto9.jpg"
import Foto10 from "../assets/ImagenesCursos/Foto10.jpg"

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
        {
            (() => {
                const Foto = cursoId % 10;
                if (Foto === 1) {
                    return <img src={Foto1} alt="Imagen del curso" />;
                } else if (Foto === 2) {
                    return <img src={Foto2} alt="Imagen del curso" />;
                } else if (Foto === 3) {
                    return <img src={Foto3} alt="Imagen del curso" />;
                } else if (Foto === 4) {
                    return <img src={Foto4} alt="Imagen del curso" />;
                } else if (Foto === 5) {
                    return <img src={Foto5} alt="Imagen del curso" />;
                } else if (Foto === 6) {
                    return <img src={Foto6} alt="Imagen del curso" />;
                } else if (Foto === 7) {
                    return <img src={Foto7} alt="Imagen del curso" />;
                } else if (Foto === 8) {
                    return <img src={Foto8} alt="Imagen del curso" />;
                } else if (Foto === 9) {
                    return <img src={Foto9} alt="Imagen del curso" />;
                } else {
                    return <img src={Foto10} alt="Imagen del curso" />;
                }
            })()
        }
        <h3>{name}</h3>
        <p>Categoría: {categoria}</p>
        <p>{descripcion}</p>
        <p>{profesor}</p>
        <p>Valoración: {valoracion}</p>
    </div>
  )
}

export default TarjetaCursos