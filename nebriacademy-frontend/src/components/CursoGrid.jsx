import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

function CursoGrid() {
  const [curso, setCurso] = useState(null);
  const [profesor, setProfesor] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    setError(null);
    fetch(`http://localhost:3000/cursos/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Error en la respuesta');
        return r.json();
      })
      .then((data) => {
          setCurso(data);
          const profId = data && data.profesor;
          if (profId) {
            fetch(`http://localhost:3000/profesores/${profId}`)
              .then((r) => {
                if (!r.ok) throw new Error('Error al obtener profesor');
                return r.json();
              })
              .then((pData) => setProfesor(pData))
              .catch((err) => {
                console.error('Error cargando profesor:', err);
              });
          }
        })
      .catch((err) => {
        console.error('Error cargando curso:', err);
        setError('No se pudo cargar el curso');
      });
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!curso) return <p>Cargando curso...</p>;

  const FotoSelector = (() => {
    const Foto = (curso.id || id) % 10;
    if (Foto === 1) return Foto1;
    if (Foto === 2) return Foto2;
    if (Foto === 3) return Foto3;
    if (Foto === 4) return Foto4;
    if (Foto === 5) return Foto5;
    if (Foto === 6) return Foto6;
    if (Foto === 7) return Foto7;
    if (Foto === 8) return Foto8;
    if (Foto === 9) return Foto9;
    return Foto10;
  })();

  return (
    <div className="CursoGrid curso-detalle">
      <div className="curso-card">
        <img src={FotoSelector} alt="Imagen del curso" />
        <h2>{curso.nombreCurso}</h2>
        <p><strong>Categoría:</strong> {curso.categoria}</p>
        <p><strong>Nivel:</strong> {curso.nivel}</p>
        <p><strong>Valoración:</strong> {curso.valoracion}</p>
        <p><strong>Profesor:</strong> {profesor ? `${profesor.nombre} ${profesor.apellidos}` : (curso.profesor ? `Profesor ID: ${curso.profesor}` : 'Desconocido')}</p>
        <p><strong>Comentarios:</strong> {curso.comentarios}</p>
        <p><strong>Descripción:</strong> {curso.descripcion}</p>
      </div>
    </div>
  );
}

export default CursoGrid;
