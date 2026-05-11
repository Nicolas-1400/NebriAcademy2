// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../../config/api";
import { useEffect, useState } from "react";
import useAuthStore from "../../../../store/useAuthStore";
import { useParams, useNavigate } from "react-router-dom";
import useToastStore from "../../../../store/toastStore";
import useModalStore from "../../../../store/modalStore";

import photo1 from "../../../../assets/CourseImages/photo1.jpg";
import photo2 from "../../../../assets/CourseImages/photo2.jpg";
import photo3 from "../../../../assets/CourseImages/photo3.jpg";
import photo4 from "../../../../assets/CourseImages/photo4.jpg";
import photo5 from "../../../../assets/CourseImages/photo5.jpg";
import photo6 from "../../../../assets/CourseImages/photo6.jpg";
import photo7 from "../../../../assets/CourseImages/photo7.jpg";
import photo8 from "../../../../assets/CourseImages/photo8.jpg";
import photo9 from "../../../../assets/CourseImages/photo9.jpg";
import photo10 from "../../../../assets/CourseImages/photo10.jpg";

import ArrowCorrect from "../../../../assets/Icons/arrow-correct.png";
import ArrowCorrectMarked from "../../../../assets/Icons/arrow-correct-marked.png";
import PlusIcon from "../../../../assets/Icons/plus.png";
import PencilIcon from "../../../../assets/Icons/pencil.png";
import PencilCancel from "../../../../assets/Icons/pencil-cancel3.png";
import EditFile from "../../../../assets/Icons/edit-file1.png";
import UploadFile2 from "../../../../assets/Icons/upload-file2.png";
import UploadFile from "../../../../assets/Icons/upload-file.png";
import DeleteIcon from "../../../../assets/Icons/delete.png";

import NoteCard from "../../Notes/NoteCard/NoteCard";
import CourseVideoCard from "../CourseVideoCard/CourseVideoCard";
import CourseExerciseCard from "../CourseExerciseCard/CourseExerciseCard";
import Avatar from "../../../common/Avatar/Avatar";
import { PERFILES } from "../../../account/ProfileImageCard/ProfileImageCard.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de detalle de un curso: muestra su contenido (vídeos, apuntes, ejercicios),
// permite a los alumnos votar, apuntarse y comentar, y al profesor editar el contenido.
function CourseGrid() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, tipo } = useAuthStore();
  const { addToast } = useToastStore();
  const { showConfirm } = useModalStore();

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const [curso, setCurso] = useState(null);
  // Estado del botón "+" para animar su rotación al abrirse el menú de añadir contenido
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contenidos, setContenidos] = useState({
    videos: [],
    apuntes: [],
    ejercicios: [],
  });
  const [rotado, setRotado] = useState(false);
  const [profesor, setProfesor] = useState(null);
  const [comentarios, setComentarios] = useState([]);

  // Datos específicos del alumno logueado: relación con el curso, likes y entregas
  const [registroUser, setRegistroUser] = useState(null);
  const [uploadedEjercicios, setUploadedEjercicios] = useState([]);
  const [likedApuntes, setLikedApuntes] = useState([]);
  const [puntuacionesEjercicios, setPuntuacionesEjercicios] = useState([]);

  // editingMode activa los controles de editar/borrar sobre el contenido del curso (solo profesor)
  const [editingMode, setEditingMode] = useState(false);
  // showAddMenu controla la visibilidad del menú desplegable para añadir contenido (solo profesor)
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [commentText, setCommentText] = useState("");
  // editingComment guarda el ID y texto del comentario que se está editando en línea
  const [editingComment, setEditingComment] = useState({ id: null, text: "" });
  // Estado para la edición de la descripción del curso
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState("");

  // ── CONSTANTES ─────────────────────────────────────────────────────────────
  // Mapa de nombre → imagen importada para resolver la portada del curso desde la BDD
  const IMAGES_MAP = {
    photo1,
    photo2,
    photo3,
    photo4,
    photo5,
    photo6,
    photo7,
    photo8,
    photo9,
    photo10,
  };

  // Obtenemos la imagen de cabecera directamente del mapa por el nombre guardado en la BDD
  const bgImage = IMAGES_MAP[curso?.imagen] || photo1;

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
        setDescriptionText(respuestaCurso.descripcion || "");

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

        if (respuestaRegistro) {
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
        } else {
          setRegistroUser({
            favorito: false,
            apuntado: false,
            valoracion: null,
          });
        }

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
    const isModerator = tipo === "administrador" || tipo === "profesor";
    const result = await showConfirm(
      "¿Eliminar este elemento?",
      "Eliminar Contenido",
      { withInput: isModerator },
    );
    if (result === false) return;

    try {
      const endpoint =
        type === "video"
          ? "videos"
          : type === "apunte"
            ? "apuntes"
            : "ejercicios";

      let url = `${API_URL}/${endpoint}/${itemId}`;
      if (isModerator && typeof result === "string" && result.trim()) {
        url += `?reason=${encodeURIComponent(result)}`;
      }

      await fetch(url, {
        method: "DELETE",
      });

      // Eliminamos el elemento del estado local sin recargar la página
      setContenidos((prev) => ({
        ...prev,
        [type + "s"]: prev[type + "s"].filter((i) => i.id !== itemId),
      }));
      addToast("Elemento eliminado", "success");
    } catch (e) {
      addToast("Error eliminando", "error");
    }
  };

  // Comprueba si el autor de un apunte es el profesor del curso usando exclusivamente el usuarioId
  const isProfesorApunte = (apunte) => {
    const auth = String(apunte?.autor || apunte?.usuarioId || "");
    if (profesor && auth === String(profesor.usuarioId)) return true;
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
        addToast("Ejercicio subido correctamente", "success");
      } else {
        addToast("Error al subir", "error");
      }
    } catch (e) {
      console.error(e);
      addToast("Error de red", "error");
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
        fetch(`${API_URL}/comentarioalumnocurso?cursoId=${id}`)
          .then((respuesta) => respuesta.json())
          .then((datos) => setComentarios(datos.Comentarios || []));
        addToast("Comentario enviado", "success");
      } else {
        addToast("Error al enviar comentario", "error");
      }
    } catch (e) {
      addToast("Error enviando comentario", "error");
    }
  };

  // Elimina un comentario con confirmación y lo quita del estado local
  const deleteComment = async (cid) => {
    // Si es administrador o profesor borrando algo que no es suyo, pedimos razón
    const isOwner =
      Number(comentarios.find((c) => c.id === cid)?.usuarioId) ===
      Number(user.usuarioId || user.id);
    const options =
      !isOwner && (tipo === "administrador" || tipo === "profesor")
        ? { withInput: true }
        : {};

    const reason = await showConfirm(
      "¿Borrar comentario?",
      "Borrar Comentario",
      options,
    );
    if (reason === false) return;

    try {
      const reasonParam =
        typeof reason === "string"
          ? `&reason=${encodeURIComponent(reason)}`
          : "";
      const url = `${API_URL}/comentarioalumnocurso/${cid}?profileId=${user.id}&tipo=${tipo}${reasonParam}`;
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) {
        setComentarios((prev) => prev.filter((c) => c.id !== cid));
        addToast("Comentario borrado", "success");
      } else {
        addToast("No se pudo borrar el comentario", "error");
      }
    } catch (e) {
      console.error(e);
      addToast("Error de conexión", "error");
    }
  };

  // Inicia la edición en línea de un comentario existente
  const startEditComment = (c) => {
    setEditingComment({ id: c.id, text: c.comentario });
  };

  const cancelEditComment = () => {
    setEditingComment({ id: null, text: "" });
  };

  // Guarda la nueva descripción del curso en el backend
  const handleSaveDescription = async () => {
    if (!descriptionText.trim()) return;
    try {
      const res = await fetch(`${API_URL}/cursos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCurso: curso.nombreCurso,
          descripcion: descriptionText,
          categoria: curso.categoria,
          nivel: curso.nivel,
          imagen: curso.imagen,
        }),
      });

      if (res.ok) {
        setCurso({ ...curso, descripcion: descriptionText });
        setEditingDescription(false);
        addToast("Descripción actualizada", "success");
      } else {
        addToast("Error al actualizar la descripción", "error");
      }
    } catch (e) {
      console.error(e);
      addToast("Error de red al actualizar descripción", "error");
    }
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
        addToast("Comentario editado", "success");
      } else {
        addToast("Error al editar comentario", "error");
      }
    } catch (e) {
      console.error(e);
      addToast("Error de red", "error");
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────────────────
  if (!curso) return <p>Cargando curso...</p>;
  if (error) return <p className="error">{error}</p>;

  // Separamos los apuntes del profesor de los de los alumnos para mostrarlos en columnas distintas y los ordenamos por likes
  const profApuntes = contenidos.apuntes
    .filter(isProfesorApunte)
    .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));
  const alumnApuntes = contenidos.apuntes
    .filter((a) => !isProfesorApunte(a))
    .sort((a, b) => (b.valoracion || 0) - (a.valoracion || 0));

  const puedeVerContenido =
    tipo === "profesor" ||
    tipo === "administrador" ||
    (tipo === "alumno" && registroUser?.apuntado);

  return (
    <div className="course-grid">
      {/* Cabecera del curso: imagen de fondo, título, categoría, nivel y controles del alumno */}
      <div className="course-header">
        <img className="course-header-bg" src={bgImage} alt="" />

        <div className="course-header-info">
          <h2>{curso.nombreCurso}</h2>
          <p>{curso.categoria}</p>
          <p>Nivel: {curso.nivel}</p>
        </div>

        {/* Botones de valoración, favorito y apuntarme: solo para alumnos */}
        {tipo === "alumno" && (
          <div className="course-header-buttons">
            <p>
              <strong>Valoración: </strong>
              <button
                className="vote-up"
                onClick={() => handleLike("valoracion", true)}
              >
                <img
                  src={
                    registroUser?.valoracion === true
                      ? ArrowCorrectMarked
                      : ArrowCorrect
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
                    registroUser?.valoracion === false
                      ? ArrowCorrectMarked
                      : ArrowCorrect
                  }
                  alt="Down"
                />
              </button>
            </p>
            <p>
              <button
                className="favorite-button"
                onClick={() => handleLike("favorito")}
              >
                {registroUser?.favorito ? "★ Favorito" : "☆ Favorito"}
              </button>
              <button
                className="enroll-button"
                onClick={() => handleLike("apuntado")}
              >
                {registroUser?.apuntado ? "✔ Apuntado" : "Apuntarme"}
              </button>
            </p>
          </div>
        )}
        {/* El profesor o los administradores, solo ven la valoración total, sin poder votar */}
        {(tipo === "profesor" || tipo === "administrador") && (
          <div className="course-header-buttons">
            <p>
              <strong>Valoración: {curso.valoracion || 0}</strong>
            </p>
          </div>
        )}
      </div>

      <div className="course-main-container">
        {/* Sección central: vídeos, apuntes y ejercicios del curso */}
        <div className="course-content">
          <h3>Contenido del curso</h3>

          {puedeVerContenido ? (
            <>
              <h4>Videos</h4>
              {contenidos.videos.length > 0 ? (
                <div className="videos-list">
                  {contenidos.videos.map((v) => (
                    <CourseVideoCard
                      key={v.id}
                      video={v}
                      tipo={tipo}
                      editingMode={editingMode}
                      handleEditNavigate={(t, i) =>
                        navigate(`/Home/Courses/${id}/EditContent`, {
                          state: { tipo: t, item: i, cursoId: id },
                        })
                      }
                      handleDeleteContenido={handleDeleteItem}
                    />
                  ))}
                </div>
              ) : (
                <p className="no-content">No hay vídeos.</p>
              )}

              <h4>Apuntes</h4>
              {/* Los apuntes se dividen en dos columnas: del profesor y de los alumnos */}
              <div className="notes-columns-wrapper">
                <div className="professor-notes">
                  <h5>Apuntes profesor</h5>
                  {profApuntes.length > 0 ? (
                    <ul className="notes-list">
                      {profApuntes.map((a) => (
                        <NoteCard
                          key={a.id}
                          apunte={a}
                          usuario={user}
                          likedIds={likedApuntes}
                          tipo={tipo}
                          editingMode={editingMode}
                          handleEditNavigate={(t, i) =>
                            navigate(`/Home/Courses/${id}/EditContent`, {
                              state: { tipo: t, item: i, cursoId: id },
                            })
                          }
                          handleDeleteContenido={handleDeleteItem}
                          onToggleLike={handleToggleApunteLike}
                        />
                      ))}
                    </ul>
                  ) : (
                    <p className="no-content">Sin apuntes.</p>
                  )}
                </div>
                <div className="student-notes">
                  <h5>Apuntes alumnos</h5>
                  {alumnApuntes.length > 0 ? (
                    <ul className="notes-list">
                      {alumnApuntes.map((a) => (
                        <NoteCard
                          key={a.id}
                          apunte={a}
                          usuario={user}
                          likedIds={likedApuntes}
                          tipo={tipo}
                          editingMode={editingMode}
                          allowEdit={false}
                          handleEditNavigate={(t, i) =>
                            navigate(`/Home/Courses/${id}/EditContent`, {
                              state: { tipo: t, item: i, cursoId: id },
                            })
                          }
                          handleDeleteContenido={handleDeleteItem}
                          onToggleLike={handleToggleApunteLike}
                        />
                      ))}
                    </ul>
                  ) : (
                    <p className="no-content">Sin apuntes.</p>
                  )}
                </div>
              </div>

              <h4>Ejercicios</h4>
              {contenidos.ejercicios.length > 0 ? (
                <div className="exercises-list">
                  {contenidos.ejercicios.map((e) => (
                    <div key={e.id} className="exercise-row">
                      <div className="exercise-row-main">
                        <CourseExerciseCard
                          ejercicio={e}
                          tipo={tipo}
                          editingMode={editingMode}
                          handleEditNavigate={(t, i) =>
                            navigate(`/Home/Courses/${id}/EditContent`, {
                              state: { tipo: t, item: i, cursoId: id },
                            })
                          }
                          handleDeleteContenido={handleDeleteItem}
                        />
                      </div>
                      <div className="exercise-row-button">
                        {tipo === "profesor" || tipo === "administrador" ? (
                          // El profesor y el admin pueden ir a la pantalla de corrección/visualización de entregas
                          <button
                            className="button-grade-exercise"
                            onClick={() =>
                              navigate(
                                `/Home/Courses/${id}/GradeExercises/${e.id}`,
                              )
                            }
                          >
                            <img src={EditFile} alt="Ver entregas" />
                          </button>
                        ) : (
                          // El alumno puede subir su entrega o ver el archivo ya subido y su nota
                          <div>
                            {(() => {
                              const entrega = uploadedEjercicios.find(
                                (ej) => ej.ejercicioId === e.id,
                              );
                              const puntuacion = entrega
                                ? puntuacionesEjercicios.find(
                                    (p) => String(p.ejercicioId) === String(entrega.id),
                                  )
                                : null;
                              return (
                                <>
                                  {entrega ? (
                                    // Si ya entregó, mostramos un enlace al archivo subido
                                    <a
                                      href={entrega.archivo}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="button-exercise-submitted"
                                    >
                                      <img
                                        src={UploadFile2}
                                        alt="Ver ejercicio"
                                      />
                                    </a>
                                  ) : (
                                    // Si no ha entregado, mostramos el input de subida disfrazado de botón
                                    <label className="button-upload-exercise">
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
                                        src={UploadFile}
                                        alt="Subir"
                                        className="img-upload-exercise"
                                      />
                                    </label>
                                  )}
                                  {/* Si el profesor ya puso nota, se muestra debajo del ejercicio */}
                                  {puntuacion && (
                                    <div className="exercise-score">
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
                <p className="no-content">No hay ejercicios.</p>
              )}
            </>
          ) : (
            <div className="not-enrolled-message">
              <p>Debes apuntarte al curso para acceder a sus contenidos.</p>
            </div>
          )}
        </div>

        {/* Panel lateral derecho: datos del profesor, descripción del curso y comentarios */}
        <div className="course-details">
          <div className="professor-details">
            <p>Profesor</p>
            {profesor ? (
              tipo === "alumno" ? (
                <span
                  className="professor-link"
                  onClick={() => navigate(`/Home/Professors/${profesor.id}`)}
                >
                  {profesor.nombre} {profesor.apellidos}
                </span>
              ) : (
                `${profesor.nombre} ${profesor.apellidos}`
              )
            ) : (
              "Desconocido"
            )}
          </div>
          <div className="description-details">
            <p>Descripción</p>
            {editingDescription ? (
              <div className="edit-description-box">
                <textarea
                  value={descriptionText}
                  onChange={(e) => setDescriptionText(e.target.value)}
                  rows={5}
                />
                <div className="edit-description-actions">
                  <button onClick={handleSaveDescription}>Guardar</button>
                  <button
                    onClick={() => {
                      setDescriptionText(curso.descripcion);
                      setEditingDescription(false);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                {curso.descripcion}
                <br />
                {/* Botón Editar solo visible si es profesor y está en editingMode */}
                {tipo === "profesor" && editingMode && (
                  <button
                    onClick={() => {
                      setDescriptionText(curso.descripcion);
                      setEditingDescription(true);
                    }}
                    className="button-edit-description"
                  >
                    Editar
                  </button>
                )}
              </>
            )}
          </div>
          <div className="comments-details">
            <p>Comentarios</p>
            {/* Caja para escribir nuevos comentarios: solo visible para alumnos, nunca admin */}
            {tipo === "alumno" && (
              <div className="write-comment">
                <textarea
                  placeholder="Comenta..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  maxLength={500}
                />
                <button onClick={handleCommentSubmit}>Enviar</button>
              </div>
            )}
            <br />
            <div className="existing-comments">
              {comentarios
                .slice()
                .sort((a, b) => b.id - a.id)
                  .map((c) => (
                  <div key={c.id} className="comment-item">
                    <div className="comment-author">
                      <Avatar
                        name={`${c.nombre} ${c.apellidos}`}
                        src={
                          c.imagenPerfil && PERFILES[c.imagenPerfil]
                            ? PERFILES[c.imagenPerfil]
                            : null
                        }
                        size="32px"
                      />
                      <span>
                        {c.nombre} {c.apellidos}
                      </span>
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
                        {/* Botones para el autor del comentario (excepto admin) */}
                        {tipo !== "administrador" &&
                        user &&
                        Number(c.usuarioId) ===
                          Number(user.usuarioId || user.id) ? (
                            <div className="comment-actions">
                            <button onClick={() => startEditComment(c)}>
                              Editar
                            </button>
                            <button onClick={() => deleteComment(c.id)}>
                              Borrar
                            </button>
                          </div>
                        ) : (
                          /* Admin o Profesor en modo edición pueden borrar cualquier comentario */
                          (tipo === "administrador" ||
                            (tipo === "profesor" && editingMode)) && (
                            <div className="comment-actions">
                              <button onClick={() => deleteComment(c.id)}>
                                Borrar
                              </button>
                            </div>
                          )
                        )}
                      </>
                    )}
                  </div>
                ))}
            </div>
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
              className="edit-course-btn"
              onClick={() => setEditingMode(!editingMode)}
              title={editingMode ? "Salir edición" : "Editar"}
            >
              <img src={editingMode ? PencilCancel : PencilIcon} alt="Edit" />
            </button>
          )}

          {/* El botón "+" de añadir contenido: visible para alumno y profesor, nunca para admin */}
          {(tipo === "profesor" || tipo === "alumno") && (
            <div className="relative-container">
              <button
                className={`upload-course-content-btn${rotado ? " rotated" : ""}`}
                onClick={() => {
                  setRotado((prev) => !prev);
                  if (tipo === "alumno") {
                    // El alumno solo puede subir apuntes
                    navigate(`/Home/AddContent/curso/${id}`, {
                      state: { tipo: "apunte", cursoId: id },
                    });
                  } else {
                    // El profesor abre un menú para elegir el tipo de contenido a subir
                    setShowAddMenu(!showAddMenu);
                  }
                }}
                title="Añadir contenido"
              >
                <img src={PlusIcon} alt="Añadir contenido" />
              </button>
              {showAddMenu && tipo === "profesor" && (
                <div className="add-menu">
                  <button
                    onClick={() =>
                      navigate(`/Home/AddContent/curso/${id}`, {
                        state: { tipo: "apunte", cursoId: id },
                      })
                    }
                  >
                    Apunte
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/Home/AddContent/curso/${id}`, {
                        state: { tipo: "video", cursoId: id },
                      })
                    }
                  >
                    Video
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/Home/AddContent/curso/${id}`, {
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

export default CourseGrid;
