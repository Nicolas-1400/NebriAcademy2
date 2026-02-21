import { useNavigate } from "react-router-dom";
import ImagenDefault from "../assets/individuo.png";
import { PERFILES } from "./TarjetaImagenPerfil";

function TarjetaProfesores({
  nombre,
  apellidos,
  especializacion,
  profesorId,
  imagenPerfil,
}) {
  const navigate = useNavigate();
  const imageSrc =
    imagenPerfil && PERFILES[imagenPerfil]
      ? PERFILES[imagenPerfil]
      : ImagenDefault;

  return (
    <div
      className="tarjeta-profesor"
      onClick={() => navigate(`/Home/Profesores/${profesorId}`)}
    >
      <img src={imageSrc} alt="Foto profesor" />
      <h3>
        {nombre} {apellidos}
      </h3>
      <p className="p-especializacion">{especializacion}</p>
    </div>
  );
}

export default TarjetaProfesores;
