import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import flecha from "../assets/flecha-correcta.png";
import ImagenPerfilDefault from "../assets/imagenPerfilUsuario.png";
import { PERFILES } from "./TarjetaImagenPerfil";
import TarjetaCursoPequena from "./TarjetaCursoPequena";

import "../styles/InfoProfesor.css"

function InfoProfesorGrid() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados
  const [profesor, setProfesor] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState(null);

  // Efectos
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [respuestaProfesor, respuestaCursos] = await Promise.all([
          fetch(`http://localhost:3000/profesores/${id}`).then((respuesta) => {
            if (!respuesta.ok) throw new Error("Error al obtener profesor");
            return respuesta.json();
          }),
          fetch("http://localhost:3000/cursos").then((respuesta) =>
            respuesta.json(),
          ),
        ]);

        setProfesor(respuestaProfesor);
        const listaCursos = Array.isArray(respuestaCursos.Cursos)
          ? respuestaCursos.Cursos
          : respuestaCursos || [];
        setCursos(
          listaCursos.filter((curso) => String(curso.profesor) === String(id)),
        );
      } catch (error) {
        console.error("Error cargando datos del profesor:", error);
        setError("No se pudo cargar la información del profesor");
      }
    };

    fetchData();
  }, [id]);

  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="profesor-contenedor-principal">
      <div className="profesor-contenedor-cursos">
        <h3>Cursos</h3>
        {cursos.length > 0 ? (
          <div className="cursos-profesor">
            {cursos.map((c) => (
              <TarjetaCursoPequena
                key={c.id}
                name={c.nombreCurso}
                cursoId={c.id}
                nivel={c.nivel}
                valoracion={c.valoracion}
                imagen={c.imagen}
              />
            ))}
          </div>
        ) : (
          <p>Este profesor no tiene cursos publicados.</p>
        )}

       
          <button className="boton-go-back" onClick={() => navigate(-1)}>
            <img src={flecha} alt="Volver" />
            <p>Volver</p>
          </button>
        
      </div>

      <div className="datosPerfil">
        <h1>Profesor</h1>
        <img
          className="imagenPerfil"
          src={
            profesor?.imagenPerfil && PERFILES[profesor.imagenPerfil]
              ? PERFILES[profesor.imagenPerfil]
              : ImagenPerfilDefault
          }
          alt="Perfil Usuario"
        />
        <h2 className="nombrePerfil">
          {profesor
            ? `${profesor.nombre} ${profesor.apellidos}`
            : "Cargando..."}
        </h2>
        <p className="correoPerfil">{profesor?.email}</p>
        {profesor?.especializacion && (
          <p className="especializacionPerfil">📚 {profesor.especializacion}</p>
        )}
        {profesor?.pais && <p className="paisPerfil">🌍 {profesor.pais}</p>}
        {profesor?.localidad && (
          <p className="localidadPerfil">🏙️ {profesor.localidad}</p>
        )}
        {profesor?.redes && <p className="redesPerfil">{profesor.redes}</p>}
      </div>
    </div>
  );
}

export default InfoProfesorGrid;
