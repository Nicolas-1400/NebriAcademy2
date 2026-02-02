import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import flecha from "../assets/flecha-correcta.png";
import ImagenPerfil from "../assets/imagenPerfilUsuario.png";
import TarjetaCursoPequena from "./TarjetaCursoPequena";

function InfoProfesorGrid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profesor, setProfesor] = useState(null);
  const [error, setError] = useState(null);
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    if (!id) return;
    setError(null);
    fetch(`http://localhost:3000/profesores/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Error al obtener profesor");
        return r.json();
      })
      .then((data) => setProfesor(data))
      .catch((e) => {
        console.error("Error cargando profesor:", e);
        setError("No se pudo cargar la información del profesor");
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch("http://localhost:3000/cursos")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.Cursos) ? data.Cursos : data || [];
        const filtered = list.filter((c) => String(c.profesor) === String(id));
        setCursos(filtered);
      })
      .catch((e) => console.error("Error cargando cursos:", e));
  }, [id]);

  if (error) return <p>{error}</p>;

  return (
    <div className="perfil">
      <div className="formularioEditarPerfil">
        <h3>Cursos</h3>
        {cursos && cursos.length > 0 ? (
          <div className="cursos-profesor">
            {cursos.map((c) => (
              <TarjetaCursoPequena
                key={c.id}
                name={c.nombreCurso}
                cursoId={c.id}
                nivel={c.nivel}
                valoracion={c.valoracion}
              />
            ))}
          </div>
        ) : (
          <p>Este profesor no tiene cursos publicados.</p>
        )}

        <div className="botones-perfil">
          <button className="boton-go-back" onClick={() => navigate(-1)}>
            <img src={flecha} alt="Volver" />
            <p>Volver</p>
          </button>
        </div>
      </div>
      <div className="datosPerfil">
        <h1>Profesor</h1>
        <img className="imagenPerfil" src={ImagenPerfil} alt="Perfil Usuario" />
        <h2 className="nombrePerfil">
          {profesor ? `${profesor.nombre} ${profesor.apellidos}` : "Profesor"}
        </h2>
        <p className="correoPerfil">{profesor?.email || ""}</p>
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
