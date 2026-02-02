import { useNavigate } from "react-router-dom";
import Foto1 from "../assets/ImagenesCursos/Foto1.jpg";
import Foto2 from "../assets/ImagenesCursos/Foto2.jpg";
import Foto3 from "../assets/ImagenesCursos/Foto3.jpg";
import Foto4 from "../assets/ImagenesCursos/Foto4.jpg";
import Foto5 from "../assets/ImagenesCursos/Foto5.jpg";
import Foto6 from "../assets/ImagenesCursos/Foto6.jpg";
import Foto7 from "../assets/ImagenesCursos/Foto7.jpg";
import Foto8 from "../assets/ImagenesCursos/Foto8.jpg";
import Foto9 from "../assets/ImagenesCursos/Foto9.jpg";
import Foto10 from "../assets/ImagenesCursos/Foto10.jpg";

function TarjetaProfesores({ nombre, apellidos, especializacion, profesorId }) {
  const navigate = useNavigate();

  const handleProfesorClick = (profesorId) => {
    navigate(`/Home/Profesores/${profesorId}`);
  };

  const renderFoto = () => {
    const mod = profesorId % 10;
    if (mod === 1) return <img src={Foto1} alt="Foto profesor" />;
    if (mod === 2) return <img src={Foto2} alt="Foto profesor" />;
    if (mod === 3) return <img src={Foto3} alt="Foto profesor" />;
    if (mod === 4) return <img src={Foto4} alt="Foto profesor" />;
    if (mod === 5) return <img src={Foto5} alt="Foto profesor" />;
    if (mod === 6) return <img src={Foto6} alt="Foto profesor" />;
    if (mod === 7) return <img src={Foto7} alt="Foto profesor" />;
    if (mod === 8) return <img src={Foto8} alt="Foto profesor" />;
    if (mod === 9) return <img src={Foto9} alt="Foto profesor" />;
    return <img src={Foto10} alt="Foto profesor" />;
  };

  return (
    <div className="tarjeta-profesor" onClick={() => handleProfesorClick(profesorId)}>
      {renderFoto()}
      <h3>{nombre} {apellidos}</h3>
      <p className="p-especializacion">{especializacion}</p>
    </div>
  );
}

export default TarjetaProfesores;