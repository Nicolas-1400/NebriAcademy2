import { useEffect, useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { useParams, useNavigate } from "react-router-dom";
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
import Mas from "../assets/mas.png";
import Editar from "../assets/lapiz.png";
import MeGusta from "../assets/me-gusta.png";
import MeGustaMarcado from "../assets/me-gusta-marcado.png";
import TarjetaApunteCurso from "./TarjetaApunteCurso";
import TarjetaVideoCurso from "./TarjetaVideoCurso";
import TarjetaEjercicioCurso from "./TarjetaEjercicioCurso";

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
  const [likedIds, setLikedIds] = useState([]);
  const [comentariosList, setComentariosList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [ejercicios, setEjercicios] = useState([]);
  const [editingMode, setEditingMode] = useState(false);
  const [uploadedEjercicios, setUploadedEjercicios] = useState([]);
  const navigate = useNavigate();

  const storeUser = useAuthStore((state) => state.user);
  const tipo = useAuthStore((state) => state.tipo);
  useEffect(() => {
    if (storeUser) setUsuario(storeUser);
  }, [storeUser]);
  const alumnoId = usuario ? usuario.id : null;

  useEffect(() => {
    if (!usuario || !usuario.id) return;
    // cargar los likes del alumno para apuntes
    fetch(`http://localhost:3000/apuntesalumnos/likes?alumnoId=${usuario.id}`)
      .then((r) => r.json())
      .then((d) => {
        setLikedIds(Array.isArray(d.apunteIds) ? d.apunteIds : []);
      })
      .catch(() => {});
  }, [usuario]);

  const handleToggleApunteLike = async (apunte) => {
    if (!usuario || !usuario.id) return;
    try {
      const r = await fetch(`http://localhost:3000/apuntesalumnos/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apunteId: apunte.id,
          alumnoId: usuario.id,
          vote: true,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Error like");
      if (d.registro) {
        const likedNow = d.registro.valoracion === true;
        setLikedIds((prev) =>
          likedNow
            ? [...new Set([...prev, apunte.id])]
            : prev.filter((x) => x !== apunte.id),
        );
      }
      if (d.apunte) {
        setApuntes((prev) =>
          prev.map((a) =>
            a.id === apunte.id ? { ...a, valoracion: d.apunte.valoracion } : a,
          ),
        );
      }
    } catch (e) {
      console.error("Error toggling apunte like", e);
    }
  };

  useEffect(() => {
    setError(null);
    fetch(`http://localhost:3000/cursos/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Error en la respuesta");
        return r.json();
      })
      .then((data) => {
        setCurso(data);
        const profId = data && data.profesor;
        if (profId) {
          fetch(`http://localhost:3000/profesores/${profId}`)
            .then((r) => {
              if (!r.ok) throw new Error("Error al obtener profesor");
              return r.json();
            })
            .then((pData) => setProfesor(pData))
            .catch((err) => {
              console.error("Error cargando profesor:", err);
            });
        }

        // la carga del registro se hace en un useEffect separado
      })
      .catch((err) => {
        console.error("Error cargando curso:", err);
        setError("No se pudo cargar el curso");
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    // cargar comentarios para este curso
    fetch(`http://localhost:3000/comentarioalumnocurso?cursoId=${id}`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.Comentarios)
          ? data.Comentarios
          : data || [];
        setComentariosList(list);
      })
      .catch((e) => console.error("Error cargando comentarios:", e));
    fetch("http://localhost:3000/apuntes")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.Apuntes) ? data.Apuntes : data || [];
        const filtered = list.filter((a) => String(a.curso) === String(id));
        setApuntes(filtered);
      })
      .catch((e) => console.error("Error cargando apuntes:", e));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetch("http://localhost:3000/videos")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.Videos) ? data.Videos : data || [];
        const filtered = list.filter((v) => String(v.curso) === String(id));
        setVideos(filtered);
      })
      .catch((e) => console.error("Error cargando videos:", e));
    fetch("http://localhost:3000/ejercicios")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.Ejercicios)
          ? data.Ejercicios
          : data || [];
        const filtered = list.filter((v) => String(v.curso) === String(id));
        setEjercicios(filtered);
      })
      .catch((e) => console.error("Error cargando ejercicios:", e));
  }, [id]);

  useEffect(() => {
    // cargar lista de profesores para mostrar nombres en tarjetas (solo profesores suben ejercicios)
    fetch("http://localhost:3000/profesores")
      .then((r) => r.json())
      .then((pRes) => {
        const profs = Array.isArray(pRes.Profesores)
          ? pRes.Profesores
          : pRes || [];
        setProfesoresList(profs);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!alumnoId) return;
    // cargar ejercicios subidos por este alumno
    fetch(`http://localhost:3000/ejerciciosalumnos`)
      .then((r) => r.json())
      .then((data) => {
        const registros = Array.isArray(data.registros) ? data.registros : data || [];
        const ids = registros
          .filter((rec) => parseInt(rec.alumnoId) === parseInt(alumnoId))
          .map((rec) => parseInt(rec.ejercicioId));
        setUploadedEjercicios(ids);
      })
      .catch(() => {});
  }, [alumnoId]);

  // cargar registro cursos-alumnos cuando alumnoId o id estén disponibles
  useEffect(() => {
    const toBool = (v) => v === true || v === 1 || v === "1";
    if (!alumnoId) return;
    fetch(
      `http://localhost:3000/cursosalumnos/registro?cursoId=${parseInt(id)}&alumnoId=${alumnoId}`,
    )
      .then(async (r) => {
        return r.json();
      })
      .then((registro) => {
        const normalized = {
          ...registro,
          favorito: toBool(registro.favorito),
          apuntado: toBool(registro.apuntado),
          valoracion:
            registro.valoracion === null || registro.valoracion === undefined
              ? null
              : toBool(registro.valoracion),
          comentario: registro.comentario || "",
        };
        setRegistroCA(normalized);
        setComentario(normalized.comentario || "");
      })
      .catch((e) => console.error("Error cargando cursosAlumnos", e));
  }, [alumnoId, id]);

  // acciones: votar, toggle favorito/apuntado, comentar
  const handleVote = async (voteBool) => {
    try {
      const res = await fetch("http://localhost:3000/cursosalumnos/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cursoId: parseInt(id),
          alumnoId,
          vote: voteBool,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.registro) setRegistroCA(data.registro);
        if (data.curso && curso)
          setCurso({ ...curso, valoracion: data.curso.valoracion });
      } else console.error(data);
    } catch (e) {
      console.error("vote error", e);
    }
  };

  const handleToggleFav = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/cursosalumnos/toggle-fav",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cursoId: parseInt(id), alumnoId }),
        },
      );
      const data = await res.json();
      if (res.ok) setRegistroCA(data);
    } catch (e) {
      console.error("fav error", e);
    }
  };

  const handleToggleApuntado = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/cursosalumnos/toggle-apuntado",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cursoId: parseInt(id), alumnoId }),
        },
      );
      const data = await res.json();
      if (res.ok) setRegistroCA(data);
    } catch (e) {
      console.error("apuntado error", e);
    }
  };

  const handleSubmitComment = async () => {
    try {
      const res = await fetch("http://localhost:3000/comentarioalumnocurso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cursoId: parseInt(id),
          usuarioId: alumnoId,
          comentario,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // recargar lista de comentarios
        const r2 = await fetch(
          `http://localhost:3000/comentarioalumnocurso?cursoId=${id}`,
        );
        const d2 = await r2.json();
        const list = Array.isArray(d2.Comentarios) ? d2.Comentarios : d2 || [];
        setComentariosList(list);
        setComentario("");
      }
    } catch (e) {
      console.error("comment error", e);
    }
  };

  const handleStartEdit = (c) => {
    setEditingId(c.id);
    setEditingText(c.comentario || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const handleSaveEdit = async (idToEdit) => {
    try {
      const res = await fetch(
        `http://localhost:3000/comentarioalumnocurso/${idToEdit}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuarioId: alumnoId,
            comentario: editingText,
          }),
        },
      );
      if (res.ok) {
        const r2 = await fetch(
          `http://localhost:3000/comentarioalumnocurso?cursoId=${id}`,
        );
        const d2 = await r2.json();
        const list = Array.isArray(d2.Comentarios) ? d2.Comentarios : d2 || [];
        setComentariosList(list);
        handleCancelEdit();
      } else {
        console.error("Error editando comentario");
      }
    } catch (e) {
      console.error("edit error", e);
    }
  };

  const handleDelete = async (idToDelete) => {
    try {
      const res = await fetch(
        `http://localhost:3000/comentarioalumnocurso/${idToDelete}?usuarioId=${alumnoId}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        setComentariosList((prev) => prev.filter((c) => c.id !== idToDelete));
      } else {
        console.error("Error borrando comentario");
      }
    } catch (e) {
      console.error("delete error", e);
    }
  };
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleNavigateAddContenidoTipo = (tipoSeleccion) => {
    // cerrar menú si estaba abierto
    setShowAddMenu(false);
    navigate(`/Home/Cursos/${id}/AddContenidoCurso`, {
      state: { tipo: tipoSeleccion, cursoId: id },
    });
  };

  const handleToggleAddMenu = () => {
    setShowAddMenu((s) => !s);
  };

  const handleToggleEditingMode = () => {
    setEditingMode((s) => !s);
  };

  const handleEditNavigate = (tipo, item) => {
    navigate(`/Home/Cursos/${id}/EditarContenidoCurso`, {
      state: { tipo, item, cursoId: id },
    });
  };

  const handleDeleteContenido = async (tipo, itemId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este elemento?")) return;
    try {
      const endpoint =
        tipo === "video"
          ? "videos"
          : tipo === "apunte"
            ? "apuntes"
            : "ejercicios";
      const res = await fetch(`http://localhost:3000/${endpoint}/${itemId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error borrando");
      // actualizar estado local según tipo
      if (tipo === "video")
        setVideos((prev) => prev.filter((v) => v.id !== itemId));
      if (tipo === "apunte")
        setApuntes((prev) => prev.filter((a) => a.id !== itemId));
      if (tipo === "ejercicio")
        setEjercicios((prev) => prev.filter((e) => e.id !== itemId));
    } catch (e) {
      console.error("delete content error", e);
      alert("No se pudo borrar el elemento");
    }
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

  const isApunteDelProfesor = (a) => {
    const autor =
      a && (a.autor || a.usuarioId || a.autorId)
        ? String(a.autor || a.usuarioId || a.autorId)
        : "";
    const cursoProf = curso && curso.profesor ? String(curso.profesor) : "";
    const profId = profesor && profesor.id ? String(profesor.id) : "";
    const profUsuarioId =
      profesor && profesor.usuarioId ? String(profesor.usuarioId) : "";
    return autor === cursoProf || autor === profId || autor === profUsuarioId;
  };

  const profesorApuntes = apuntes.filter((a) => isApunteDelProfesor(a));
  const alumnosApuntes = apuntes.filter((a) => !isApunteDelProfesor(a));

  return (
    <div className="curso-grid">
      {/* HEADER CON IMAGEN DE FONDO Y BOTONES */}
      <div className="curso-header">
        <img className="curso-header-bg" src={FotoSelector} alt="" />
        <div className="curso-header-info">
          <h2>{curso.nombreCurso}</h2>
          <p>{curso.categoria}</p>
          <p>Nivel: {curso.nivel}</p>
        </div>
        {tipo === "alumno" ? (
          <div className="curso-header-botones">
            <p>
              <strong>Valoración: </strong>
              <button className="vote-up" onClick={() => handleVote(true)}>
                <img
                  src={
                    registroCA && registroCA.valoracion === true
                      ? FlechaMarcada
                      : Flecha
                  }
                  alt="up"
                />
              </button>
              <strong> {curso.valoracion} </strong>
              <button className="vote-down" onClick={() => handleVote(false)}>
                <img
                  src={
                    registroCA && registroCA.valoracion === false
                      ? FlechaMarcada
                      : Flecha
                  }
                  alt="down"
                />
              </button>
            </p>
            <p>
              <button className="btn-favorito" onClick={handleToggleFav}>
                {registroCA && registroCA.favorito
                  ? "★ Favorito"
                  : "☆ Favorito"}
              </button>
              <button className="btn-apuntarme" onClick={handleToggleApuntado}>
                {registroCA && registroCA.apuntado ? "✔ Apuntado" : "Apuntarme"}
              </button>
            </p>
          </div>
        ) : (
          <div className="curso-header-botones">
            <p>
              <strong>Valoración: {curso.valoracion}</strong>
            </p>
          </div>
        )}
      </div>

      {/* CONTENIDO PRINCIPAL: 75% + DETALLES: 25% */}
      <div className="curso-contenedor-principal">
        {/* CONTENIDO DEL CURSO - 75% */}
        <div className="contenido-curso">
          <h3>Contenido del curso</h3>
          {videos && videos.length > 0 ? (
            <div className="videos-list">
              <h4>Vídeos</h4>
              {videos.map((v) => (
                <TarjetaVideoCurso
                  key={v.id}
                  video={v}
                  tipo={tipo}
                  editingMode={editingMode}
                  handleEditNavigate={handleEditNavigate}
                  handleDeleteContenido={handleDeleteContenido}
                />
              ))}
            </div>
          ) : (
            <p>No hay vídeos para este curso.</p>
          )}
          <h4>Apuntes</h4>
          {apuntes && apuntes.length > 0 ? (
            <div className="apuntes-columns-wrapper">
              <div className="apuntes-list profesor-apuntes">
                <h5>Apuntes del profesor</h5>
                {profesorApuntes && profesorApuntes.length > 0 ? (
                  <ul>
                    {profesorApuntes.map((a) => (
                      <TarjetaApunteCurso
                        key={a.id}
                        apunte={a}
                        usuario={usuario}
                        likedIds={likedIds}
                        onToggleLike={() => handleToggleApunteLike(a)}
                        tipo={tipo}
                        editingMode={editingMode}
                        handleEditNavigate={handleEditNavigate}
                        handleDeleteContenido={handleDeleteContenido}
                      />
                    ))}
                  </ul>
                ) : (
                  <p>No hay apuntes del profesor.</p>
                )}
              </div>
              <div className="apuntes-list alumnos-apuntes">
                <h5>Apuntes de los estudiantes</h5>
                {alumnosApuntes && alumnosApuntes.length > 0 ? (
                  <ul>
                    {alumnosApuntes.map((a) => (
                      <TarjetaApunteCurso
                        key={a.id}
                        apunte={a}
                        usuario={usuario}
                        likedIds={likedIds}
                        onToggleLike={() => handleToggleApunteLike(a)}
                        tipo={tipo}
                        editingMode={editingMode}
                        handleEditNavigate={handleEditNavigate}
                        handleDeleteContenido={handleDeleteContenido}
                      />
                    ))}
                  </ul>
                ) : (
                  <p>No hay apuntes de alumnos.</p>
                )}
              </div>
            </div>
          ) : (
            <p>No hay apuntes para este curso.</p>
          )}
          <h4>Ejercicios</h4>
          {ejercicios && ejercicios.length > 0 ? (
              <div className="apuntes-list profesores-apuntes">
                {ejercicios.map((e) => (
                  <div key={e.id} className="ejercicio-row">
                    <div className="ejercicio-row-main">
                      <TarjetaEjercicioCurso
                        ejercicio={e}
                        tipo={tipo}
                        editingMode={editingMode}
                        handleEditNavigate={handleEditNavigate}
                        handleDeleteContenido={handleDeleteContenido}
                      />
                    </div>
                    <div className="ejercicio-row-actions">
                      {tipo === "profesor" ? (
                        <button
                          onClick={() => navigate(`/Home/Cursos/${id}/CorregirEjercicios/${e.id}`)}
                          className="btn-corregir-ejercicio"
                        >
                          Corregir ejercicio
                        </button>
                      ) : (
                        <div>
                          {uploadedEjercicios.includes(e.id) ? (
                            <button disabled className="btn-ejercicio-subido">Ejercicio subido</button>
                          ) : (
                            <>
                              <input
                                type="file"
                                id={`file-input-ej-${e.id}`}
                                style={{ display: 'none' }}
                                onChange={async (ev) => {
                                  const file = ev.target.files && ev.target.files[0];
                                  if (!file) return;
                                  const form = new FormData();
                                  form.append('archivo', file);
                                  form.append('ejercicioId', e.id);
                                  form.append('alumnoId', alumnoId);
                                  try {
                                    const res = await fetch('http://localhost:3000/ejerciciosalumnos', {
                                      method: 'POST',
                                      body: form,
                                    });
                                    const d = await res.json();
                                    if (res.ok) {
                                      setUploadedEjercicios((prev) => [...new Set([...prev, e.id])]);
                                    } else {
                                      alert(d.error || 'Error subiendo archivo');
                                    }
                                  } catch (err) {
                                    console.error('upload error', err);
                                    alert('Error subiendo archivo');
                                  }
                                }}
                                accept="*"
                              />
                              <button
                                onClick={() => document.getElementById(`file-input-ej-${e.id}`).click()}
                                className="btn-subir-ejercicio"
                              >
                                Subir ejercicio
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
          ) : (
            <p>No hay ejercicios para este curso.</p>
          )}
        </div>

        {/* DETALLES - 25% */}
        <div className="curso-detalles">
          <div className="detalles-profesor">
            <p>Profesor</p>
            {profesor
              ? `${profesor.nombre} ${profesor.apellidos}`
              : curso.profesor
                ? `Profesor ID: ${curso.profesor}`
                : "Desconocido"}
          </div>
          <div className="detalles-descripcion">
            <p>Descripción</p>
            {curso.descripcion}
          </div>
          <div className="detalles-comentarios">
            <p>Comentarios</p>
            <div className="comentarios-existentes">
              {comentariosList && comentariosList.length > 0 ? (
                comentariosList.map((c) => (
                  <div key={c.id} className="comentario-item">
                    <div className="comentario-autor">
                      {c.nombre} {c.apellidos}
                    </div>
                    <div>
                      {editingId === c.id ? (
                        <div>
                          <textarea
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            maxLength={500}
                          />
                          <button onClick={() => handleSaveEdit(c.id)}>
                            Guardar
                          </button>
                          <button onClick={handleCancelEdit}>Cancelar</button>
                        </div>
                      ) : (
                        <p>{c.comentario}</p>
                      )}
                    </div>
                    {alumnoId && c.usuarioId === alumnoId ? (
                      <div>
                        {editingId !== c.id ? (
                          <>
                            <button onClick={() => handleStartEdit(c)}>
                              Editar
                            </button>
                            <button onClick={() => handleDelete(c.id)}>
                              Borrar
                            </button>
                          </>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <p>No hay comentarios para este curso.</p>
              )}
            </div>
            {alumnoId ? (
              <div className="escribir-comentario">
                <textarea
                  maxLength={500}
                  placeholder="Escribe un comentario (max 500)"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                />
                <button onClick={handleSubmitComment}>Enviar comentario</button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {tipo === "profesor" ? (
        <div className="fixed-action-group">
          <button
            className="editarCurso"
            onClick={handleToggleEditingMode}
            title={editingMode ? "Salir de edición" : "Editar contenido"}
          >
            <img src={Editar} alt="Editar contenido" />
          </button>
          <div className="relative-container">
            <button
              className="subirContenidoCurso"
              onClick={handleToggleAddMenu}
              title="Añadir contenido"
            >
              <img src={Mas} alt="Subir contenido" />
            </button>
            {showAddMenu ? (
              <div className="add-menu">
                <button
                  onClick={() => handleNavigateAddContenidoTipo("apunte")}
                >
                  Subir apunte
                </button>
                <button onClick={() => handleNavigateAddContenidoTipo("video")}>
                  Subir vídeo
                </button>
                <button
                  onClick={() => handleNavigateAddContenidoTipo("ejercicio")}
                >
                  Subir ejercicio
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="fixed-action-group">
          <button
            className="subirContenidoCurso"
            onClick={() => handleNavigateAddContenidoTipo("apunte")}
            title="Subir apunte"
          >
            <img src={Mas} alt="Subir contenido" />
          </button>
        </div>
      )}
    </div>
  );
}

export default CursoGrid;
