// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../config/api";
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

import Flecha from "../assets/Iconos/flecha-correcta.png";
import FlechaMarcada from "../assets/Iconos/flecha-correcta-marcada.png";
import Mas from "../assets/Iconos/mas.png";
import Lapiz from "../assets/Iconos/lapiz.png";
import SalirEdicion from "../assets/Iconos/lapiz-cancelar3.png";
import CorregirEjercicio2 from "../assets/Iconos/editar-archivo1.png";
import EjercicioSubido from "../assets/Iconos/subir-archivo2.png";
import SubirEjercicio from "../assets/Iconos/subir-archivo.png";
import Eliminar from "../assets/Iconos/Eliminar.png";

import TarjetaApunteCurso from "./TarjetaApunteCurso";
import TarjetaVideoCurso from "./TarjetaVideoCurso";
import TarjetaEjercicioCurso from "./TarjetaEjercicioCurso";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de detalle de un curso: muestra su contenido (vídeos, apuntes, ejercicios),
// permite a los alumnos votar, apuntarse y comentar, y al profesor editar el contenido.
function CursoGrid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, tipo } = useAuthStore();

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const [curso, setCurso] = useState(null);
  // Estado del botón "+" para animar su rotación al abrirse el menú de añadir contenido
  const [rotado, setRotado] = useState(false);
  const [profesor, setProfesor] = useState(null);
  const [contenidos, setContenidos] = useState({
    videos: [],
    apuntes: [],
    ejercicios: [],
  });
  const [comentarios, setComentarios] = useState([]);

  // Datos específicos del alumno logueado: relación con el curso, likes y entregas
  const [registroUser, setRegistroUser] = useState(null);
  const [uploadedEjercicios, setUploadedEjercicios] = useState([]);
  const [likedApuntes, setLikedApuntes] = useState([]);
  const [puntuacionesEjercicios, setPuntuacionesEjercicios] = useState([]);

  const [error, setError] = useState(null);
  // editingMode activa los controles de editar/borrar sobre el contenido del curso (solo profesor)
  const [editingMode, setEditingMode] = useState(false);
  // showAddMenu controla la visibilidad del menú desplegable para añadir contenido (solo profesor)
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [commentText, setCommentText] = useState("");
  // editingComment guarda el ID y texto del comentario que se está editando en línea
  const [editingComment, setEditingComment] = useState({ id: null, text: "" });

  // ── CONSTANTES ─────────────────────────────────────────────────────────────
  // Mapa de nombre → imagen importada para resolver la portada del curso desde la BDD
  const IMAGES_MAP = {
    Foto1,
    Foto2,
    Foto3,
    Foto4,
    Foto5,
    Foto6,
    Foto7,
    Foto8,
    Foto9,
    Foto10,
  };

  // Obtenemos la imagen de cabecera directamente del mapa por el nombre guardado en la BDD
  const bgImage = IMAGES_MAP[curso?.imagen] || Foto1;

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Carga principal: curso, vídeos, apuntes (con nombre de autor), ejercicios y comentarios
  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      try {
        const respuestaCurso = await fetch(`${API_URL}/cursos/${id}`).then(
          (respuesta) => (respuesta.ok ? respuesta.json() : null),
        );
        if (!respuestaCurso) throw new Error("Curso no encontrado");
        setCurso(respuestaCurso);

        // Bloquear acceso si es un alumno vinculado intentando ver un curso de su profe
        if (
          user?.esVinculado &&
          respuestaCurso.profesor === user.profesorVinculadoId
        ) {
          navigate("/Home", { replace: true });
          return;
        }

        // Cargamos el profesor del curso en paralelo sin bloquear el resto
        if (respuestaCurso.profesor) {
          fetch(`${API_URL}/profesores/${respuestaCurso.profesor}`)
            .then((respuesta) => respuesta.json())
            .then(setProfesor)
            .catch(console.warn);
        }

        const [
          datosVideos,
          datosApuntes,
          datosEjercicios,
          datosProfes,
          datosAlumnos,
        ] = await Promise.all([
          fetch(`${API_URL}/videos`).then((respuesta) => respuesta.json()),
          fetch(`${API_URL}/apuntes`).then((respuesta) => respuesta.json()),
          fetch(`${API_URL}/ejercicios`).then((respuesta) => respuesta.json()),
          fetch(`${API_URL}/profesores`).then((r) => r.json()),
          fetch(`${API_URL}/alumnos`).then((r) => r.json()),
        ]);

        // Resuelve el nombre completo del autor de un apunte buscando entre alumnos y profesores
        const resolveName = (id) => {
          const aid = Number(id);
          const alum = (datosAlumnos.Alumnos || []).find(
            (a) => Number(a.usuarioId) === aid,
          );
          if (alum) return `${alum.nombre} ${alum.apellidos}`;
          const prof = (datosProfes.Profesores || []).find(
            (p) => Number(p.usuarioId) === aid,
          );
          if (prof) return `${prof.nombre} ${prof.apellidos}`;
          return "Autor no encontrado";
        };

        // Filtramos el contenido global para quedarnos solo con el de este curso
        const filterById = (list) =>
          (list || []).filter((i) => String(i.curso) === String(id));

        // Añadimos a cada apunte el nombre del autor para mostrarlo en la tarjeta
        const apuntesFiltrados = filterById(datosApuntes.Apuntes).map((a) => ({
          ...a,
          nombreAutor: resolveName(a.autor),
        }));

        setContenidos({
          videos: filterById(datosVideos.Videos),
          apuntes: apuntesFiltrados,
          ejercicios: filterById(datosEjercicios.Ejercicios),
        });

        fetch(`${API_URL}/comentarioalumnocurso?cursoId=${id}`)
          .then((respuesta) => respuesta.json())
          .then((datos) => setComentarios(datos.Comentarios || []));
      } catch (e) {
        console.error(e);
        setError("Error cargando el curso");
      }
    };

    fetchAll();
  }, [id]);

  // Carga los datos personalizados del alumno logueado: relación con el curso, likes y entregas
  useEffect(() => {
    if (!user || tipo !== "alumno") return;

    const fetchUserData = async () => {
      try {
        const respuestaRegistro = await fetch(
          `${API_URL}/cursosalumnos/registro?cursoId=${id}&alumnoId=${user.id}`,
        ).then((respuesta) => respuesta.json());

        // Normalizamos los booleanos que MySQL puede devolver como 0/1 o "0"/"1"
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

        const [likesData, ejerciciosData, puntuacionesData] = await Promise.all(
          [
            fetch(`${API_URL}/apuntesalumnos/likes?alumnoId=${user.id}`)
              .then((r) => r.json())
              .catch(() => ({ apunteIds: [] })),
            fetch(`${API_URL}/ejerciciosalumnos`)
              .then((r) => r.json())
              .catch(() => ({ registros: [] })),
            fetch(`${API_URL}/puntuacionesejercicios`)
              .then((r) => r.json())
              .catch(() => ({ PuntuacionesEjercicios: [] })),
          ],
        );

        setLikedApuntes(likesData.apunteIds || []);

        // Solo cargamos las entregas y puntuaciones del alumno logueado
        const misEntregas = (ejerciciosData.registros || []).filter(
          (registro) => String(registro.alumnoId) === String(user.id),
        );
        setUploadedEjercicios(misEntregas);

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

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Elimina un elemento de contenido del curso (vídeo, apunte o ejercicio) con confirmación
  const handleDeleteItem = async (type, itemId) => {
    if (!window.confirm("¿Eliminar este elemento?")) return;
    try {
      const endpoint =
        type === "video"
          ? "videos"
          : type === "apunte"
            ? "apuntes"
            : "ejercicios";
      await fetch(`${API_URL}/${endpoint}/${itemId}`, {
        method: "DELETE",
      });

      // Eliminamos el elemento del estado local sin recargar la página
      setContenidos((prev) => ({
        ...prev,
        [type + "s"]: prev[type + "s"].filter((i) => i.id !== itemId),
      }));
    } catch (e) {
      alert("Error eliminando");
    }
  };

  // Comprueba si el autor de un apunte es el profesor del curso
  const isProfesorApunte = (apunte) => {
    const auth = String(apunte?.autor || apunte?.usuarioId || "");
    if (curso?.profesor && auth === String(curso.profesor)) return true;
    if (
      profesor &&
      (auth === String(profesor.id) || auth === String(profesor.usuarioId))
    )
      return true;
    return false;
  };

  // Gestiona las acciones del alumno sobre el curso: valorar, marcar favorito y apuntarse
  const handleLike = async (action, value) => {
    try {
      let url;
      let body = { cursoId: id, alumnoId: user.id };

      if (action === "valoracion") {
        url = `${API_URL}/cursosalumnos/vote`;
        body.vote = value;
      } else if (action === "favorito") {
        url = `${API_URL}/cursosalumnos/toggle-fav`;
      } else if (action === "apuntado") {
        url = `${API_URL}/cursosalumnos/toggle-apuntado`;
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
        const reg = datos.registro || datos;

        // Actualizamos el estado local del registro del alumno normalizando booleanos
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

        // Si la acción es valoración, actualizamos también el contador en la cabecera
        if (action === "valoracion" && datos.curso) {
          setCurso((c) => ({ ...c, valoracion: datos.curso.valoracion }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Alterna el like de un apunte del alumno y actualiza el contador localmente
  const handleToggleApunteLike = async (apunte) => {
    if (!user?.id || tipo !== "alumno") return;
    try {
      const res = await fetch(`${API_URL}/apuntesalumnos/vote`, {
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
        // Actualizamos el contador de likes en el contenido local sin recargar
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

  // Sube la entrega de un ejercicio del alumno al servidor y la registra en el estado local
  const uploadEjercicio = async (file, ejercicioId) => {
    try {
      const form = new FormData();
      form.append("archivo", file);
      form.append("ejercicioId", ejercicioId);
      form.append("profileId", user.id);

      const respuesta = await fetch(`${API_URL}/ejerciciosalumnos`, {
        method: "POST",
        body: form,
      });
      if (respuesta.ok) {
        const datos = await respuesta.json();
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

  // Envía un nuevo comentario al backend y recarga la lista de comentarios del curso
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const respuesta = await fetch(`${API_URL}/comentarioalumnocurso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cursoId: id,
          profileId: user.id,
          tipo: tipo,
          comentario: commentText,
        }),
      });
      if (respuesta.ok) {
        setCommentText("");
        // Recargamos la lista para mostrar el nuevo comentario con nombre del autor
        fetch(`${API_URL}/comentarioalumnocurso?cursoId=${id}`)
          .then((respuesta) => respuesta.json())
          .then((datos) => setComentarios(datos.Comentarios || []));
      } else {
        alert("Error al enviar comentario");
      }
    } catch (e) {
      alert("Error enviando comentario");
    }
  };

  // Elimina un comentario con confirmación y lo quita del estado local
  const deleteComment = async (cid) => {
    if (!window.confirm("Borrar comentario?")) return;
    try {
      const url = `${API_URL}/comentarioalumnocurso/${cid}?profileId=${user.id}&tipo=${tipo}`;
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

  // Inicia la edición en línea de un comentario existente
  const startEditComment = (c) => {
    setEditingComment({ id: c.id, text: c.comentario });
  };

  const cancelEditComment = () => {
    setEditingComment({ id: null, text: "" });
  };

  // Guarda el texto editado del comentario en el backend y actualiza el estado local
  const saveEditComment = async () => {
    if (!editingComment.text.trim()) return;
    try {
      const res = await fetch(
        `${API_URL}/comentarioalumnocurso/${editingComment.id}`,
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

  // ── RENDER ───────────────────────────────────────────────────────────────────
  if (!curso) return <p>Cargando curso...</p>;
  if (error) return <p className="error">{error}</p>;

  // Separamos los apuntes del profesor de los de los alumnos para mostrarlos en columnas distintas
  const profApuntes = contenidos.apuntes.filter(isProfesorApunte);
  const alumnApuntes = contenidos.apuntes.filter((a) => !isProfesorApunte(a));

  const puedeVerContenido =
    tipo === "profesor" ||
    tipo === "administrador" ||
    (tipo === "alumno" && registroUser?.apuntado);

  return (
    <div className="curso-grid">
      {/* Cabecera del curso: imagen de fondo, título, categoría, nivel y controles del alumno */}
      <div className="curso-header">
        <img className="curso-header-bg" src={bgImage} alt="" />
        <div className="curso-header-info">
          <h2>{curso.nombreCurso}</h2>
          <p>{curso.categoria}</p>
          <p>Nivel: {curso.nivel}</p>
        </div>

        {/* Botones de valoración, favorito y apuntarme: solo para alumnos */}
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
        {/* El profesor o los administradores, solo ven la valoración total, sin poder votar */}
        {(tipo === "profesor" || tipo === "administrador") && (
          <div className="curso-header-botones">
            <p>
              <strong>Valoración: {curso.valoracion || 0}</strong>
            </p>
          </div>
        )}
      </div>

      <div className="curso-contenedor-principal">
        {/* Sección central: vídeos, apuntes y ejercicios del curso */}
        <div className="contenido-curso">
          <h3>Contenido del curso</h3>

          {puedeVerContenido ? (
            <>
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
                <p className="sin-contenido">No hay vídeos.</p>
              )}

              <h4>Apuntes</h4>
              {/* Los apuntes se dividen en dos columnas: del profesor y de los alumnos */}
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
                            navigate(
                              `/Home/Cursos/${id}/EditarContenidoCurso`,
                              {
                                state: { tipo: t, item: i, cursoId: id },
                              },
                            )
                          }
                          handleDeleteContenido={handleDeleteItem}
                          onToggleLike={handleToggleApunteLike}
                        />
                      ))}
                    </ul>
                  ) : (
                    <p className="sin-contenido">Sin apuntes.</p>
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
                            navigate(
                              `/Home/Cursos/${id}/EditarContenidoCurso`,
                              {
                                state: { tipo: t, item: i, cursoId: id },
                              },
                            )
                          }
                          handleDeleteContenido={handleDeleteItem}
                          onToggleLike={handleToggleApunteLike}
                        />
                      ))}
                    </ul>
                  ) : (
                    <p className="sin-contenido">Sin apuntes.</p>
                  )}
                </div>
              </div>

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
                            navigate(
                              `/Home/Cursos/${id}/EditarContenidoCurso`,
                              {
                                state: { tipo: t, item: i, cursoId: id },
                              },
                            )
                          }
                          handleDeleteContenido={handleDeleteItem}
                        />
                      </div>
                      <div className="ejercicio-row-boton">
                        {tipo === "profesor" || tipo === "administrador" ? (
                          // El profesor y el admin pueden ir a la pantalla de corrección/visualización de entregas
                          <button
                            className="btn-corregir-ejercicio"
                            onClick={() =>
                              navigate(
                                `/Home/Cursos/${id}/CorregirEjercicios/${e.id}`,
                              )
                            }
                          >
                            <img src={CorregirEjercicio2} alt="Ver entregas" />
                          </button>
                        ) : (
                          // El alumno puede subir su entrega o ver el archivo ya subido y su nota
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
                                    // Si ya entregó, mostramos un enlace al archivo subido
                                    <a
                                      href={entrega.archivo}
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
                                    // Si no ha entregado, mostramos el input de subida disfrazado de botón
                                    <label className="btn-subir-ejercicio">
                                      <input
                                        type="file"
                                        className="file-input-hidden"
                                        onChange={(ev) =>
                                          ev.target.files?.[0] &&
                                          uploadEjercicio(
                                            ev.target.files[0],
                                            e.id,
                                          )
                                        }
                                      />
                                      <img
                                        src={SubirEjercicio}
                                        alt="Subir"
                                        className="img-subir-ejercicio"
                                      />
                                    </label>
                                  )}
                                  {/* Si el profesor ya puso nota, se muestra debajo del ejercicio */}
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
                <p className="sin-contenido">No hay ejercicios.</p>
              )}
            </>
          ) : (
            <div className="mensaje-no-apuntado">
              <p>Debes apuntarte al curso para acceder a sus contenidos.</p>
            </div>
          )}
        </div>

        {/* Panel lateral derecho: datos del profesor, descripción del curso y comentarios */}
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
                    // Formulario de edición en línea para el comentario activo
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
                      {/* Admin puede borrar cualquier comentario sin restricción */}
                      {tipo === "administrador" && (
                        <div className="comentario-acciones">
                          <button onClick={() => deleteComment(c.id)}>
                            Borrar
                          </button>
                        </div>
                      )}
                      {/* Los botones de editar/borrar solo aparecen al autor del comentario (no para admin) */}
                      {tipo !== "administrador" &&
                        user &&
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
            {/* Caja para escribir nuevos comentarios: solo visible para alumnos, nunca admin */}
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

      {/* Botones flotantes: modo edición (profesor/admin) y añadir contenido (profesor/alumno, nunca admin) */}
      {(tipo === "profesor" ||
        tipo === "alumno" ||
        tipo === "administrador") && (
        <div className="fixed-action-group">
          {/* El botón de editar/borrar contenido es visible solo para profesor */}
          {tipo === "profesor" && (
            <button
              className="editarCurso"
              onClick={() => setEditingMode(!editingMode)}
              title={editingMode ? "Salir edición" : "Editar"}
            >
              <img src={editingMode ? SalirEdicion : Lapiz} alt="Edit" />
            </button>
          )}

          {/* El botón "+" de añadir contenido: visible para alumno y profesor, nunca para admin */}
          {(tipo === "profesor" || tipo === "alumno") && (
            <div className="relative-container">
              <button
                className={`subirContenidoCurso${rotado ? " rotated" : ""}`}
                onClick={() => {
                  setRotado((prev) => !prev);
                  if (tipo === "alumno") {
                    // El alumno solo puede subir apuntes
                    navigate(`/Home/AddContenido/curso/${id}`, {
                      state: { tipo: "apunte", cursoId: id },
                    });
                  } else {
                    // El profesor abre un menú para elegir el tipo de contenido a subir
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
                      navigate(`/Home/AddContenido/curso/${id}`, {
                        state: { tipo: "apunte", cursoId: id },
                      })
                    }
                  >
                    Apunte
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/Home/AddContenido/curso/${id}`, {
                        state: { tipo: "video", cursoId: id },
                      })
                    }
                  >
                    Video
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/Home/AddContenido/curso/${id}`, {
                        state: { tipo: "ejercicio", cursoId: id },
                      })
                    }
                  >
                    Ejercicio
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CursoGrid;
