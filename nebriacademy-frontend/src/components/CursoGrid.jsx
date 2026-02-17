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
import Lapiz from "../assets/lapiz.png";
import SalirEdicion from "../assets/lapiz-cancelar3.png";
import CorregirEjercicio2 from "../assets/editar-archivo1.png";
import EjercicioSubido from "../assets/subir-archivo2.png";
import SubirEjercicio from "../assets/subir-archivo.png";

import TarjetaApunteCurso from "./TarjetaApunteCurso";
import TarjetaVideoCurso from "./TarjetaVideoCurso";
import TarjetaEjercicioCurso from "./TarjetaEjercicioCurso";

/**
 * Componente: CursoGrid
 * Pagina de detalle del curso. Muestra videos, apuntes, ejercicios y chat/comentarios.
 * Gestiona vistas para profesor (editor) y alumno.
 */
function CursoGrid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, tipo } = useAuthStore();

  // Datos del Curso
  const [curso, setCurso] = useState(null);
  // Estado para rotar el botón de subir contenido
  const [rotado, setRotado] = useState(false);
  const [profesor, setProfesor] = useState(null);
  const [contenidos, setContenidos] = useState({
    videos: [],
    apuntes: [],
    ejercicios: [],
  });
  const [comentarios, setComentarios] = useState([]);

  // Estado Usuario-Curso
  const [registroUser, setRegistroUser] = useState(null); // { apuntado, favorito, valoracion, comentario }
  const [uploadedEjercicios, setUploadedEjercicios] = useState([]);
  const [likedApuntes, setLikedApuntes] = useState([]);
  const [puntuacionesEjercicios, setPuntuacionesEjercicios] = useState([]);

  // UI States
  const [error, setError] = useState(null);
  const [editingMode, setEditingMode] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [editingComment, setEditingComment] = useState({ id: null, text: "" });

  const fotos = [
    Foto10,
    Foto1,
    Foto2,
    Foto3,
    Foto4,
    Foto5,
    Foto6,
    Foto7,
    Foto8,
    Foto9,
  ];
  const bgImage = fotos[(curso?.id || id) % 10] || Foto1;

  // --- Carga Inicial ---
  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      try {
        // 1. Cargar Curso
        const respuestaCurso = await fetch(
          `http://localhost:3000/cursos/${id}`,
        ).then((respuesta) => (respuesta.ok ? respuesta.json() : null));
        if (!respuestaCurso) throw new Error("Curso no encontrado");
        setCurso(respuestaCurso);

        // 2. Cargar Profesor
        if (respuestaCurso.profesor) {
          fetch(`http://localhost:3000/profesores/${respuestaCurso.profesor}`)
            .then((respuesta) => respuesta.json())
            .then(setProfesor)
            .catch(console.warn);
        }

        // 3. Cargar Contenidos y Usuarios (paralelo)
        const [
          datosVideos,
          datosApuntes,
          datosEjercicios,
          datosProfes,
          datosAlumnos,
        ] = await Promise.all([
          fetch("http://localhost:3000/videos").then((respuesta) =>
            respuesta.json(),
          ),
          fetch("http://localhost:3000/apuntes").then((respuesta) =>
            respuesta.json(),
          ),
          fetch("http://localhost:3000/ejercicios").then((respuesta) =>
            respuesta.json(),
          ),
          fetch("http://localhost:3000/profesores").then((r) => r.json()),
          fetch("http://localhost:3000/alumnos").then((r) => r.json()),
        ]);

        // Helper para resolver nombres de autor
        const resolveName = (id) => {
          const aid = Number(id);
          const alum = (datosAlumnos.Alumnos || []).find(
            (a) => Number(a.usuarioId) === aid || Number(a.id) === aid,
          );
          if (alum) return `${alum.nombre} ${alum.apellidos}`;
          const prof = (datosProfes.Profesores || []).find(
            (p) => Number(p.usuarioId) === aid || Number(p.id) === aid,
          );
          if (prof) return `${prof.nombre} ${prof.apellidos}`;
          return "Desconocido";
        };

        // Helper para filtrar solo los contenidos que pertenecen a este curso
        const filterById = (list) =>
          (list || []).filter((i) => String(i.curso) === String(id));

        // Cambiar el id por el nombre del autor
        const apuntesFiltrados = filterById(datosApuntes.Apuntes).map((a) => ({
          ...a,
          nombreAutor: resolveName(a.autor),
        }));

        setContenidos({
          videos: filterById(datosVideos.Videos),
          apuntes: apuntesFiltrados,
          ejercicios: filterById(datosEjercicios.Ejercicios),
        });

        // 4. Cargar Comentarios
        fetch(`http://localhost:3000/comentarioalumnocurso?cursoId=${id}`)
          .then((respuesta) => respuesta.json())
          .then((datos) => setComentarios(datos.Comentarios || []));
      } catch (e) {
        console.error(e);
        setError("Error cargando el curso");
      }
    };

    fetchAll();
  }, [id]);

  // --- Carga Datos Usuario (si es alumno) ---
  useEffect(() => {
    if (!user || tipo !== "alumno") return;

    const fetchUserData = async () => {
      try {
        // Estado Matricula
        const respuestaRegistro = await fetch(
          `http://localhost:3000/cursosalumnos/registro?cursoId=${id}&alumnoId=${user.id}`,
        ).then((respuesta) => respuesta.json());
        // Normalizar bools
        const toBool = (v) => v === true || v === 1 || v === "1";
        setRegistroUser({
          ...respuestaRegistro,
          favorito: toBool(respuestaRegistro.favorito),
          apuntado: toBool(respuestaRegistro.apuntado),
          valoracion:
            respuestaRegistro.valoracion == null
              ? null
              : toBool(respuestaRegistro.valoracion),
        });
        if (respuestaRegistro.comentario)
          setCommentText(respuestaRegistro.comentario);

        // Likes de Apuntes - Cargar en paralelo
        const [likesData, ejerciciosData, puntuacionesData] = await Promise.all(
          [
            fetch(
              `http://localhost:3000/apuntesalumnos/likes?alumnoId=${user.id}`,
            )
              .then((r) => r.json())
              .catch(() => ({ apunteIds: [] })),
            fetch(`http://localhost:3000/ejerciciosalumnos`)
              .then((r) => r.json())
              .catch(() => ({ registros: [] })),
            fetch(`http://localhost:3000/puntuacionesejercicios`)
              .then((r) => r.json())
              .catch(() => ({ PuntuacionesEjercicios: [] })),
          ],
        );

        // Actualizar likes
        setLikedApuntes(likesData.apunteIds || []);

        // Actualizar ejercicios subidos - Guardar datos completos para acceder al archivo
        const misEntregas = (ejerciciosData.registros || []).filter(
          (registro) => String(registro.alumnoId) === String(user.id),
        );
        setUploadedEjercicios(misEntregas);

        // Actualizar puntuaciones de ejercicios
        const misPuntuaciones = (
          puntuacionesData.PuntuacionesEjercicios || []
        ).filter((p) => String(p.alumnoId) === String(user.id));
        setPuntuacionesEjercicios(misPuntuaciones);
      } catch (e) {
        console.error("Error cargando datos usuario", e);
      }
    };

    fetchUserData();
  }, [id, user, tipo]);

  // --- Handlers Profesor ---
  const handleDeleteItem = async (type, itemId) => {
    if (!window.confirm("¿Eliminar este elemento?")) return;
    try {
      const endpoint =
        type === "video"
          ? "videos"
          : type === "apunte"
            ? "apuntes"
            : "ejercicios";
      await fetch(`http://localhost:3000/${endpoint}/${itemId}`, {
        method: "DELETE",
      });

      setContenidos((prev) => ({
        ...prev,
        [type + "s"]: prev[type + "s"].filter((i) => i.id !== itemId), // videos, apuntes, ejercicios
      }));
    } catch (e) {
      alert("Error eliminando");
    }
  };

  const isProfesorApunte = (apunte) => {
    // Si coincide con ID profesor curso o el profesor cargado
    const auth = String(apunte?.autor || apunte?.usuarioId || "");
    if (curso?.profesor && auth === String(curso.profesor)) return true;
    if (
      profesor &&
      (auth === String(profesor.id) || auth === String(profesor.usuarioId))
    )
      return true;
    return false; // Simplificado
  };

  // Manejo de la lógica de "Me gusta" o "Apuntarse"
  // Action puede ser: 'favorito', 'apuntado', 'valoracion'
  // value se usa para 'valoracion' (true/false)
  const handleLike = async (action, value) => {
    try {
      let url;
      let body = { cursoId: id, alumnoId: user.id };

      // Determinamos el endpoint y el cuerpo de la solicitud según la acción
      if (action === "valoracion") {
        url = "http://localhost:3000/cursosalumnos/vote";
        body.vote = value; // value será true para upvote, false para downvote
      } else if (action === "favorito") {
        url = "http://localhost:3000/cursosalumnos/toggle-fav";
      } else if (action === "apuntado") {
        url = "http://localhost:3000/cursosalumnos/toggle-apuntado";
      } else {
        console.error("Acción no reconocida:", action);
        return;
      }

      const respuesta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (respuesta.ok) {
        const datos = await respuesta.json();
        const reg = datos.registro || datos; // backend devuelve registro o {registro...}
        // update local state
        const toBool = (v) => v === true || v === 1 || v === "1";
        setRegistroUser((prev) => ({
          ...prev,
          ...reg,
          favorito:
            reg.favorito !== undefined ? toBool(reg.favorito) : prev?.favorito,
          apuntado:
            reg.apuntado !== undefined ? toBool(reg.apuntado) : prev?.apuntado,
          valoracion:
            reg.valoracion !== undefined
              ? reg.valoracion == null
                ? null
                : toBool(reg.valoracion)
              : prev?.valoracion,
        }));

        // Actualizar el contador de valoración del curso si la acción fue votar
        if (action === "valoracion" && datos.curso) {
          setCurso((c) => ({ ...c, valoracion: datos.curso.valoracion }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleApunteLike = async (apunte) => {
    if (!user?.id || tipo !== "alumno") return;
    try {
      const res = await fetch("http://localhost:3000/apuntesalumnos/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apunteId: apunte.id,
          alumnoId: user.id,
          vote: true,
        }),
      });
      const d = await res.json();
      if (res.ok) {
        const isLike = d.registro?.valoracion === true;
        setLikedApuntes((prev) =>
          isLike ? [...prev, apunte.id] : prev.filter((x) => x !== apunte.id),
        );
        setContenidos((prev) => ({
          ...prev,
          apuntes: prev.apuntes.map((a) =>
            a.id === apunte.id ? { ...a, valoracion: d.apunte?.valoracion } : a,
          ),
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const uploadEjercicio = async (file, ejercicioId) => {
    try {
      const form = new FormData();
      form.append("archivo", file);
      form.append("ejercicioId", ejercicioId);
      // Backend espera profileId para validar contra la tabla Alumnos
      form.append("profileId", user.id);

      const respuesta = await fetch("http://localhost:3000/ejerciciosalumnos", {
        method: "POST",
        body: form,
      });
      if (respuesta.ok) {
        const datos = await respuesta.json();
        // Agregar el registro completo al estado para tener acceso al archivo
        const nuevoRegistro = {
          id: datos.id,
          ejercicioId: ejercicioId,
          alumnoId: user.id,
          archivo: datos.archivo,
        };
        setUploadedEjercicios((prev) => [...prev, nuevoRegistro]);
        alert("Ejercicio subido correctamente");
      } else {
        alert("Error al subir");
      }
    } catch (e) {
      console.error(e);
      alert("Error de red");
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const respuesta = await fetch(
        "http://localhost:3000/comentarioalumnocurso",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cursoId: id,
            profileId: user.id, // Send profile ID
            tipo: tipo, // Send user type
            comentario: commentText,
          }),
        },
      );
      if (respuesta.ok) {
        setCommentText("");
        // Reload comments
        fetch(`http://localhost:3000/comentarioalumnocurso?cursoId=${id}`)
          .then((respuesta) => respuesta.json())
          .then((datos) => setComentarios(datos.Comentarios || []));
      } else {
        alert("Error al enviar comentario");
      }
    } catch (e) {
      alert("Error enviando comentario");
    }
  };

  const deleteComment = async (cid) => {
    if (!window.confirm("Borrar comentario?")) return;
    try {
      const url = `http://localhost:3000/comentarioalumnocurso/${cid}?profileId=${user.id}&tipo=${tipo}`;
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        setComentarios((prev) => prev.filter((c) => c.id !== cid));
      } else {
        alert("No se pudo borrar el comentario");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startEditComment = (c) => {
    setEditingComment({ id: c.id, text: c.comentario });
  };

  const cancelEditComment = () => {
    setEditingComment({ id: null, text: "" });
  };

  const saveEditComment = async () => {
    if (!editingComment.text.trim()) return;
    try {
      const res = await fetch(
        `http://localhost:3000/comentarioalumnocurso/${editingComment.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profileId: user.id,
            tipo: tipo,
            comentario: editingComment.text,
          }),
        },
      );
      if (res.ok) {
        // Update local state
        setComentarios((prev) =>
          prev.map((c) =>
            c.id === editingComment.id
              ? { ...c, comentario: editingComment.text }
              : c,
          ),
        );
        cancelEditComment();
      } else {
        alert("Error al editar comentario");
      }
    } catch (e) {
      console.error(e);
      alert("Error de red");
    }
  };

  if (!curso) return <p>Cargando curso...</p>;
  if (error) return <p className="error">{error}</p>;

  // Filtered Apuntes
  const profApuntes = contenidos.apuntes.filter(isProfesorApunte);
  const alumnApuntes = contenidos.apuntes.filter((a) => !isProfesorApunte(a));

  return (
    <div className="curso-grid">
      {/* HEADER */}
      <div className="curso-header">
        <img className="curso-header-bg" src={bgImage} alt="" />
        <div className="curso-header-info">
          <h2>{curso.nombreCurso}</h2>
          <p>{curso.categoria}</p>
          <p>Nivel: {curso.nivel}</p>
        </div>

        {tipo === "alumno" && (
          <div className="curso-header-botones">
            <p>
              <strong>Valoración: </strong>
              <button
                className="vote-up"
                onClick={() => handleLike("valoracion", true)}
              >
                <img
                  src={
                    registroUser?.valoracion === true ? FlechaMarcada : Flecha
                  }
                  alt="Up"
                />
              </button>
              <strong> {curso.valoracion || 0} </strong>
              <button
                className="vote-down"
                onClick={() => handleLike("valoracion", false)}
              >
                <img
                  src={
                    registroUser?.valoracion === false ? FlechaMarcada : Flecha
                  }
                  alt="Down"
                />
              </button>
            </p>
            <p>
              <button
                className="btn-favorito"
                onClick={() => handleLike("favorito")}
              >
                {registroUser?.favorito ? "★ Favorito" : "☆ Favorito"}
              </button>
              <button
                className="btn-apuntarme"
                onClick={() => handleLike("apuntado")}
              >
                {registroUser?.apuntado ? "✔ Apuntado" : "Apuntarme"}
              </button>
            </p>
          </div>
        )}
        {tipo === "profesor" && (
          <div className="curso-header-botones">
            <p>
              <strong>Valoración: {curso.valoracion || 0}</strong>
            </p>
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="curso-contenedor-principal">
        <div className="contenido-curso">
          <h3>Contenido del curso</h3>

          {/* VIDEOS */}
          <h4>Vídeos</h4>
          {contenidos.videos.length > 0 ? (
            <div className="videos-list">
              {contenidos.videos.map((v) => (
                <TarjetaVideoCurso
                  key={v.id}
                  video={v}
                  tipo={tipo}
                  editingMode={editingMode}
                  handleEditNavigate={(t, i) =>
                    navigate(`/Home/Cursos/${id}/EditarContenidoCurso`, {
                      state: { tipo: t, item: i, cursoId: id },
                    })
                  }
                  handleDeleteContenido={handleDeleteItem}
                />
              ))}
            </div>
          ) : (
            <p>No hay vídeos.</p>
          )}

          {/* APUNTES */}
          <h4>Apuntes</h4>
          <div className="apuntes-columns-wrapper">
            <div className="profesor-apuntes">
              <h5>Apuntes profesor</h5>
              {profApuntes.length > 0 ? (
                <ul className="apuntes-list">
                  {profApuntes.map((a) => (
                    <TarjetaApunteCurso
                      key={a.id}
                      apunte={a}
                      usuario={user}
                      likedIds={likedApuntes}
                      tipo={tipo}
                      editingMode={editingMode}
                      handleEditNavigate={(t, i) =>
                        navigate(`/Home/Cursos/${id}/EditarContenidoCurso`, {
                          state: { tipo: t, item: i, cursoId: id },
                        })
                      }
                      handleDeleteContenido={handleDeleteItem}
                      onToggleLike={handleToggleApunteLike}
                    />
                  ))}
                </ul>
              ) : (
                <p>Sin apuntes.</p>
              )}
            </div>
            <div className="alumnos-apuntes">
              <h5>Apuntes alumnos</h5>
              {alumnApuntes.length > 0 ? (
                <ul className="apuntes-list">
                  {alumnApuntes.map((a) => (
                    <TarjetaApunteCurso
                      key={a.id}
                      apunte={a}
                      usuario={user}
                      likedIds={likedApuntes}
                      tipo={tipo}
                      editingMode={editingMode}
                      handleEditNavigate={(t, i) =>
                        navigate(`/Home/Cursos/${id}/EditarContenidoCurso`, {
                          state: { tipo: t, item: i, cursoId: id },
                        })
                      }
                      handleDeleteContenido={handleDeleteItem}
                      onToggleLike={handleToggleApunteLike}
                    />
                  ))}
                </ul>
              ) : (
                <p>Sin apuntes.</p>
              )}
            </div>
          </div>

          {/* EJERCICIOS */}
          <h4>Ejercicios</h4>
          {contenidos.ejercicios.length > 0 ? (
            <div className="ejercicios-list">
              {contenidos.ejercicios.map((e) => (
                <div key={e.id} className="ejercicio-row">
                  <div className="ejercicio-row-main">
                    <TarjetaEjercicioCurso
                      ejercicio={e}
                      tipo={tipo}
                      editingMode={editingMode}
                      handleEditNavigate={(t, i) =>
                        navigate(`/Home/Cursos/${id}/EditarContenidoCurso`, {
                          state: { tipo: t, item: i, cursoId: id },
                        })
                      }
                      handleDeleteContenido={handleDeleteItem}
                    />
                  </div>
                  <div className="ejercicio-row-boton">
                    {tipo === "profesor" ? (
                      <button
                        className="btn-corregir-ejercicio"
                        onClick={() =>
                          navigate(
                            `/Home/Cursos/${id}/CorregirEjercicios/${e.id}`,
                          )
                        }
                      >
                        <img src={CorregirEjercicio2} alt="Corregir" />
                      </button>
                    ) : (
                      <div>
                        {(() => {
                          const entrega = uploadedEjercicios.find(
                            (ej) => ej.ejercicioId === e.id,
                          );
                          const puntuacion = puntuacionesEjercicios.find(
                            (p) => p.ejercicioId === e.id,
                          );
                          return (
                            <>
                              {entrega ? (
                                <a
                                  href={`http://localhost:3000/ejerciciosalumnos/files/${entrega.archivo}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn-ejercicio-subido"
                                >
                                  <img
                                    src={EjercicioSubido}
                                    alt="Ver ejercicio"
                                  />
                                </a>
                              ) : (
                                <label className="btn-subir-ejercicio">
                                  <input
                                    type="file"
                                    className="file-input-hidden"
                                    onChange={(ev) =>
                                      ev.target.files?.[0] &&
                                      uploadEjercicio(ev.target.files[0], e.id)
                                    }
                                  />
                                  <img
                                    src={SubirEjercicio}
                                    alt="Subir"
                                    className="img-subir-ejercicio"
                                  />
                                </label>
                              )}
                              {puntuacion && (
                                <div className="puntuacion-ejercicio">
                                  <p>Nota: {puntuacion.puntuacion}</p>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay ejercicios.</p>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="curso-detalles">
          <div className="detalles-profesor">
            <p>Profesor</p>
            {profesor
              ? `${profesor.nombre} ${profesor.apellidos}`
              : "Desconocido"}
          </div>
          <div className="detalles-descripcion">
            <p>Descripción</p>
            {curso.descripcion}
          </div>
          <div className="detalles-comentarios">
            <p>Comentarios</p>
            <div className="comentarios-existentes">
              {comentarios.map((c) => (
                <div key={c.id} className="comentario-item">
                  <div className="comentario-autor">
                    {c.nombre} {c.apellidos}
                  </div>
                  {editingComment.id === c.id ? (
                    <div className="edit-comment-box">
                      <textarea
                        value={editingComment.text}
                        onChange={(e) =>
                          setEditingComment({
                            ...editingComment,
                            text: e.target.value,
                          })
                        }
                      />
                      <button onClick={saveEditComment}>Guardar</button>
                      <button onClick={cancelEditComment}>Cancelar</button>
                    </div>
                  ) : (
                    <>
                      <p>{c.comentario}</p>
                      {user &&
                        Number(c.usuarioId) ===
                          Number(user.usuarioId || user.id) && (
                          <div className="comentario-acciones">
                            <button onClick={() => startEditComment(c)}>
                              Editar
                            </button>
                            <button onClick={() => deleteComment(c.id)}>
                              Borrar
                            </button>
                          </div>
                        )}
                    </>
                  )}
                </div>
              ))}
            </div>
            {tipo === "alumno" && (
              <div className="escribir-comentario">
                <textarea
                  placeholder="Comenta..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  maxLength={500}
                />
                <button onClick={handleCommentSubmit}>Enviar</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Acciones (Profesor: Todo | Alumno: Subir Apunte) */}
      {(tipo === "profesor" || tipo === "alumno") && (
        <div className="fixed-action-group">
          {tipo === "profesor" && (
            <button
              className="editarCurso"
              onClick={() => setEditingMode(!editingMode)}
              title={editingMode ? "Salir edición" : "Editar"}
            >
              <img src={editingMode ? SalirEdicion : Lapiz} alt="Edit" />
            </button>
          )}
          <div className="relative-container">
            <button
              className={`subirContenidoCurso${rotado ? " rotated" : ""}`}
              onClick={() => {
                setRotado((prev) => !prev);
                if (tipo === "alumno") {
                  navigate(`/Home/Cursos/${id}/AddContenidoCurso`, {
                    state: { tipo: "apunte", cursoId: id },
                  });
                } else {
                  setShowAddMenu(!showAddMenu);
                }
              }}
              title="Añadir contenido"
            >
              <img src={Mas} alt="Añadir contenido" />
            </button>
            {showAddMenu && tipo === "profesor" && (
              <div className="add-menu">
                <button
                  onClick={() =>
                    navigate(`/Home/Cursos/${id}/AddContenidoCurso`, {
                      state: { tipo: "apunte", cursoId: id },
                    })
                  }
                >
                  Apunte
                </button>
                <button
                  onClick={() =>
                    navigate(`/Home/Cursos/${id}/AddContenidoCurso`, {
                      state: { tipo: "video", cursoId: id },
                    })
                  }
                >
                  Video
                </button>
                <button
                  onClick={() =>
                    navigate(`/Home/Cursos/${id}/AddContenidoCurso`, {
                      state: { tipo: "ejercicio", cursoId: id },
                    })
                  }
                >
                  Ejercicio
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CursoGrid;
