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
import Flecha from "../assets/flecha-correcta.png";
import FlechaMarcada from "../assets/flecha-correcta-marcada.png";

function CursoGrid() {
  const [curso, setCurso] = useState(null);
  const [profesor, setProfesor] = useState(null);
  const [apuntes, setApuntes] = useState([]);
  const [error, setError] = useState(null);
  const [registroCA, setRegistroCA] = useState(null);
  const [comentario, setComentario] = useState("");
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    const usuarioIniciado = localStorage.getItem('usuario');
    setUsuario(JSON.parse(usuarioIniciado));
  }, []);
  const alumnoId = usuario ? usuario.id : null;

  useEffect(() => {
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

          // la carga del registro se hace en un useEffect separado
        })
      .catch((err) => {
        console.error('Error cargando curso:', err);
        setError('No se pudo cargar el curso');
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch('http://localhost:3000/apuntes')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.Apuntes) ? data.Apuntes : (data || []);
        const filtered = list.filter(a => String(a.curso) === String(id));
        setApuntes(filtered);
      })
      .catch((e) => console.error('Error cargando apuntes:', e));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch('http://localhost:3000/videos')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.Videos) ? data.Videos : (data || []);
        const filtered = list.filter(v => String(v.curso) === String(id));
        setVideos(filtered);
      })
      .catch((e) => console.error('Error cargando videos:', e));
  }, [id]);

  // cargar registro cursos-alumnos cuando alumnoId o id estén disponibles
  useEffect(() => {
    const toBool = (v) => v === true || v === 1 || v === '1';
    if (!alumnoId) return;
    fetch(`http://localhost:3000/cursosalumnos/registro?cursoId=${parseInt(id)}&alumnoId=${alumnoId}`)
      .then(async (r) => {
        return r.json();
      })
      .then((registro) => {
        const normalized = {
          ...registro,
          favorito: toBool(registro.favorito),
          apuntado: toBool(registro.apuntado),
          valoracion: registro.valoracion === null || registro.valoracion === undefined ? null : toBool(registro.valoracion),
          comentario: registro.comentario || ""
        };
        setRegistroCA(normalized);
        setComentario(normalized.comentario || "");
      })
      .catch((e) => console.error('Error cargando cursosAlumnos', e));
  }, [alumnoId, id]);

  // acciones: votar, toggle favorito/apuntado, comentar
  const handleVote = async (voteBool) => {
    try {
      const res = await fetch('http://localhost:3000/cursosalumnos/vote', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cursoId: parseInt(id), alumnoId, vote: voteBool })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.registro) setRegistroCA(data.registro);
        if (data.curso && curso) setCurso({ ...curso, valoracion: data.curso.valoracion });
      } else console.error(data);
    } catch (e) { console.error('vote error', e); }
  };

  const handleToggleFav = async () => {
    try {
      const res = await fetch('http://localhost:3000/cursosalumnos/toggle-fav', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cursoId: parseInt(id), alumnoId })
      });
      const data = await res.json();
      if (res.ok) setRegistroCA(data);
    } catch (e) { console.error('fav error', e); }
  };

  const handleToggleApuntado = async () => {
    try {
      const res = await fetch('http://localhost:3000/cursosalumnos/toggle-apuntado', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cursoId: parseInt(id), alumnoId })
      });
      const data = await res.json();
      if (res.ok) setRegistroCA(data);
    } catch (e) { console.error('apuntado error', e); }
  };

  const handleSubmitComment = async () => {
    try {
      const res = await fetch('http://localhost:3000/cursosalumnos/comment', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cursoId: parseInt(id), alumnoId, comentario })
      });
      const data = await res.json();
      if (res.ok) setRegistroCA(data);
    } catch (e) { console.error('comment error', e); }
  };

  if (error) return <p>{error}</p>;
  if (!curso) return;

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
    <div className="cursoGrid">
      <div className="curso-card">
        <img src={FotoSelector} alt="Imagen del curso" />
        <h2>{curso.nombreCurso}</h2>
        <p>{curso.categoria}</p>
        <p><strong>Nivel:</strong> {curso.nivel}</p>
        {alumnoId ? (
          <>
            <p>
              <strong>Valoración:</strong> {curso.valoracion}
              <button className="vote" onClick={() => handleVote(true)} >
                <img src={registroCA && registroCA.valoracion === true ? FlechaMarcada : Flecha} alt="up" />
              </button>
              <button className="vote" onClick={() => handleVote(false)} >
                <img src={registroCA && registroCA.valoracion === false ? FlechaMarcada : Flecha} alt="down" />
              </button>
            </p>
            <p>
              <button onClick={handleToggleFav}>{registroCA && registroCA.favorito ? '★ Favorito' : '☆ Favorito'}</button>
              <button onClick={handleToggleApuntado} >{registroCA && registroCA.apuntado ? '✔ Apuntado' : 'Apuntarme'}</button>
            </p>
            <p>
              <textarea maxLength={500} placeholder="Escribe un comentario (max 500)" value={comentario} onChange={(e)=>setComentario(e.target.value)} />
              <br />
              <button onClick={handleSubmitComment}>Enviar comentario</button>
            </p>
          </>
        ) : null}
        <p><strong>Profesor:</strong> {profesor ? `${profesor.nombre} ${profesor.apellidos}` : (curso.profesor ? `Profesor ID: ${curso.profesor}` : 'Desconocido')}</p>
        <p><strong>Comentarios:</strong> {curso.comentarios}</p>
        <p><strong>Descripción:</strong> {curso.descripcion}</p>
      </div>
      <div className="contenido-curso">
        <h3>Contenido del curso</h3>
        {apuntes && apuntes.length > 0 ? (
          <div className="apuntes-list">
            <h4>Apuntes</h4>
            <ul>
              {apuntes.map((a) => (
                <li key={a.id}>
                  <a href={`http://localhost:3000/apuntes/files/${a.archivo}`} target="_blank" rel="noreferrer">{a.archivo}</a>
                  {a.descripcion ? <p>{a.descripcion}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No hay apuntes para este curso.</p>
        )}
        {videos && videos.length > 0 ? (
          <div className="videos-list">
            <h4>Vídeos</h4>
            {videos.map((v) => (
              <div key={v.id} className="video-item">
                {v.nombre ? <h5>{v.nombre}</h5> : null}
                <video controls>
                  <source src={`http://localhost:3000/videos/files/${v.archivo}`} type="video/mp4" />
                  Tu navegador no soporta el elemento <code>video</code>.
                </video>
                
              </div>
            ))}
          </div>
        ) : (
          <p>No hay vídeos para este curso.</p>
        )}
      </div>
    </div>
  );
}

export default CursoGrid;
