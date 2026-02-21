// ==========================================
// 1. IMPORTACIONES
// ==========================================
// Módulos base de React para ciclo de vida y gestión de estado
import { useEffect, useState } from "react";
// Store global de autenticación gestionado con Zustand
import useAuthStore from "../store/useAuthStore";
// Utilidades de enrutamiento para extraer parámetros (id del curso) y re-direccionar
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

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// CursoGrid: Interfaz completa de detalle de un Curso Específico.
// Gobierna la visualización de la cabecera, la distribución de contenidos (Videos, Apuntes, Ejercicios),
// la interacciones sociales (Comentarios, Valoraciones, Favoritos, Apuntarse)
// y los modos dinámicos según el tipo de persona que mira (Profesor dueño vs Alumno matriculado).
function CursoGrid() {
  // Extrae el ID del curso de la URL actual (ej: /Home/Cursos/14 => id=14)
  const { id } = useParams();
  const navigate = useNavigate();
  // Obtiene el objeto de sesión actual del almacén global Zustand
  const { user, tipo } = useAuthStore();

  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================

  const [curso, setCurso] = useState(null); // Metadata del curso actual
  const [rotado, setRotado] = useState(false); // Animación CSS giratoria para el botón "+"
  const [profesor, setProfesor] = useState(null); // Metadata del profesor dueño
  // Centraliza todos los contenidos anudados a este ID de curso en la DB
  const [contenidos, setContenidos] = useState({
    videos: [],
    apuntes: [],
    ejercicios: [],
  });
  const [comentarios, setComentarios] = useState([]); // Foro/Hilo de comentarios públicos

  // Mantiene el tracking de si el usuario ha dado like, se ha apuntado, o si lo tiene por favorito
  const [registroUser, setRegistroUser] = useState(null);
  const [uploadedEjercicios, setUploadedEjercicios] = useState([]); // Entregas del alumno en esta asignatura
  const [likedApuntes, setLikedApuntes] = useState([]); // Array de IDs de apuntes que este usuario valoró positivamente
  const [puntuacionesEjercicios, setPuntuacionesEjercicios] = useState([]); // Notas ya asignadas por el profesor

  const [error, setError] = useState(null);
  const [editingMode, setEditingMode] = useState(false); // Alterna la vista de profesor para poder borrar/modificar
  const [showAddMenu, setShowAddMenu] = useState(false); // Desplegable de profesor: ¿Añadir Video, Apunte o Ejercicio?
  const [commentText, setCommentText] = useState(""); // Input controlado para enviar un nuevo comentario
  const [editingComment, setEditingComment] = useState({ id: null, text: "" }); // Input controlado para alterar un comentario existente

  // ==========================================
  // 4. MAPEO ESTÁTICO DE IMÁGENES
  // ==========================================
  // Si no se carga dinámicamente o existe un patrón de fallback, recurrimos a este mapeo manual.
  const fotos = [
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
  ];

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

  // Resuelve la foto de portada del curso comprobando si coincide con la base de datos
  // Y aportando un renderizado "hash" matemático basado en el ID para evitar bloques vacíos.
  const getHeaderImage = () => {
    if (curso?.imagen && IMAGES_MAP[curso.imagen])
      return IMAGES_MAP[curso.imagen];
    const cid = curso?.id || id;
    return fotos[cid % 10] || Foto1;
  };

  const bgImage = getHeaderImage();

  // ==========================================
  // 5. EFECTOS DEL CICLO DE VIDA (DATOS DEL CURSO)
  // ==========================================

  // Se gatilla solo una vez cada que cambia la URL de la página. (Component Mount / Param Change)
  useEffect(() => {
    if (!id) return;

    const fetchAll = async () => {
      try {
        // 1. Carga del Curso Primario
        const respuestaCurso = await fetch(
          `http://localhost:3000/cursos/${id}`,
        ).then((respuesta) => (respuesta.ok ? respuesta.json() : null));

        if (!respuestaCurso) throw new Error("Curso no encontrado");
        setCurso(respuestaCurso);

        // 2. Carga Secundaria: Datos del Profesor que dicta el curso
        if (respuestaCurso.profesor) {
          fetch(`http://localhost:3000/profesores/${respuestaCurso.profesor}`)
            .then((respuesta) => respuesta.json())
            .then(setProfesor)
            .catch(console.warn);
        }

        // 3. Carga Terciaria Paralela: Contenidos asociados al Id de esta materia y
        // descarga de diccionarios de personas para interpolar la autoría visualmente.
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

        // Helper Interno: Permite buscar IDs de autor cruzando la data de profesores y alumnos.
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

        // Helper Interno: Desecha basura o contenidos de otras IDs ajenas a las de esta vista.
        const filterById = (list) =>
          (list || []).filter((i) => String(i.curso) === String(id));

        // Expansión especial en Apuntes para pintar quién los ha redactado.
        const apuntesFiltrados = filterById(datosApuntes.Apuntes).map((a) => ({
          ...a,
          nombreAutor: resolveName(a.autor),
        }));

        setContenidos({
          videos: filterById(datosVideos.Videos),
          apuntes: apuntesFiltrados,
          ejercicios: filterById(datosEjercicios.Ejercicios),
        });

        // 4. Carga Cuaternaria: Registro de interacciones sociales (Comentarios Globales)
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

  // ==========================================
  // 6. EFECTOS DEL CICLO DE VIDA (DATOS DEL USUARIO LOGUEADO)
  // ==========================================

  // Se encarga exclusivamente de resolver si hemos interactuado previamenta para poder pintar de colores correctos las valoraciones
  useEffect(() => {
    if (!user || tipo !== "alumno") return;

    const fetchUserData = async () => {
      try {
        // Obtenemos si el alumno está apuntado (Matriculado) o si ya lo reseñó en el pasado
        const respuestaRegistro = await fetch(
          `http://localhost:3000/cursosalumnos/registro?cursoId=${id}&alumnoId=${user.id}`,
        ).then((respuesta) => respuesta.json());

        // Normalización booleana a expensas de inconsistencias en backend
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

        // Auto-popular el draft actual de su comentario si había iniciado uno.
        if (respuestaRegistro.comentario)
          setCommentText(respuestaRegistro.comentario);

        // Fetch masivo del inventario de lo que ha interactuado el alumno (likes dados, notas recibidas y subidas)
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

        setLikedApuntes(likesData.apunteIds || []);

        // Filtrado de todas las entregas globales para sacar exclusivamente las del alumno presente
        const misEntregas = (ejerciciosData.registros || []).filter(
          (registro) => String(registro.alumnoId) === String(user.id),
        );
        setUploadedEjercicios(misEntregas);

        // Filtrado del boletín de notas maestro en esta asignatura
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

  // ==========================================
  // 7. FUNCIONES Y HANDLERS DE EVENTOS
  // ==========================================

  // Maneja el borrado de cualquier contenido del Grid que estemos viendo (Video, Apunte, Ejercicio)
  // Usado únicamente cuando `editingMode` es True por el Profesor dueño.
  const handleDeleteItem = async (type, itemId) => {
    if (!window.confirm("¿Eliminar este elemento?")) return;
    try {
      // Rutadores dinámicos condicionados por el originador
      const endpoint =
        type === "video"
          ? "videos"
          : type === "apunte"
            ? "apuntes"
            : "ejercicios";

      await fetch(`http://localhost:3000/${endpoint}/${itemId}`, {
        method: "DELETE",
      });

      // Modificación reactiva del Front-End sin refrescar la ventana asíncronamente (Mutamos Contenidos)
      setContenidos((prev) => ({
        ...prev,
        [type + "s"]: prev[type + "s"].filter((i) => i.id !== itemId),
      }));
    } catch (e) {
      alert("Error eliminando");
    }
  };

  // Verifica si un contenido pertenece al profesor de este curso en particular, o no.
  // Permite separar visualmente la lista final entre "Apuntes del profesor" (Material Base) y "Apuntes Alumnos" (Social)
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

  // Switch masivo de interacciones del usuario de la sesión y el CURSO como entidad global.
  // Responde a: Votar positivo, Votar negativo, Marcar/Desmarcar Favorito y Pulsar boton Apuntarme.
  const handleLike = async (action, value) => {
    try {
      let url;
      let body = { cursoId: id, alumnoId: user.id };

      if (action === "valoracion") {
        url = "http://localhost:3000/cursosalumnos/vote";
        body.vote = value;
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
        const reg = datos.registro || datos;

        const toBool = (v) => v === true || v === 1 || v === "1";

        // Reflejo optimista de forma parcial (actualiza el estado de interfaz interrelacional en DB)
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

        // La valoración de la materia muta la nota media general (que debe verse en Header de curso)
        if (action === "valoracion" && datos.curso) {
          setCurso((c) => ({ ...c, valoracion: datos.curso.valoracion }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Emisión de Me Gustas hacia los *Apuntes Individuales* que componen el temario.
  // No de la asignatura conjunta que es manejado por el helper de arriba.
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
        // Inclusión o Evacuación del Id respectivo desde el Array Trackeador
        setLikedApuntes((prev) =>
          isLike ? [...prev, apunte.id] : prev.filter((x) => x !== apunte.id),
        );
        // Regeneración React en estado profundo para refrescar el corazón de UI en la tarjeta precisa
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

  // Función asíncrona dedicada que procesa un bloque binario (PDF/Doc) para responder
  // una tarea exigida por el profesor dueño de este curso, por parte del usuario logeado.
  const uploadEjercicio = async (file, ejercicioId) => {
    try {
      const form = new FormData();
      form.append("archivo", file);
      form.append("ejercicioId", ejercicioId); // Match con la consigna
      form.append("profileId", user.id); // Match con el Alumno remitente

      const respuesta = await fetch("http://localhost:3000/ejerciciosalumnos", {
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
        // Permite esconder el botón "+" y mostrar instantaneamente el check verde de ejercicio entregado
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

  // Petición HTTP POST para alojar un hilo de comentario textual público dentro de esta materia.
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
            profileId: user.id,
            tipo: tipo,
            comentario: commentText,
          }),
        },
      );
      if (respuesta.ok) {
        setCommentText("");
        // Reload fresco para garantizar que pintemos la fecha de base de datos correctamente en lista
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

  // Destruye un comentario del foro basándonos en su Id Primaria en SQL
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

  // Mutación a un sub-estado UI para sustituir el texto por un Input text in-place (Modo Edición Rápida).
  const startEditComment = (c) => {
    setEditingComment({ id: c.id, text: c.comentario });
  };

  // Reversión simple para ocultar el bloque Input y reanudar lectura tradicional de la DB de Comentarios.
  const cancelEditComment = () => {
    setEditingComment({ id: null, text: "" });
  };

  // Re-escritura oficial de un texto previo. Emite en la red el Payload de la String modificada.
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
        // ==========================================
        // 8. Actualización optimista para evitar el re-fetch en cascada total
        // ==========================================
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

  // ==========================================
  // 9. CÁLCULOS RENDER POST-CARGA
  // ==========================================

  if (!curso) return <p>Cargando curso...</p>;
  if (error) return <p className="error">{error}</p>;

  // División del conglomerado general de Apuntes en dos vectores independientes:
  // Materiales de clase provistos por el Profesor dueño y Aportes colaborativos sociales realizados por discentes
  const profApuntes = contenidos.apuntes.filter(isProfesorApunte);
  const alumnApuntes = contenidos.apuntes.filter((a) => !isProfesorApunte(a));

  // ==========================================
  // 10. BLOQUE DE RENDERIZADO (RETURN JSX)
  // ==========================================
  return (
    <div className="curso-grid">
      {/* SECCIÓN A: CABECERA TITULAR DEL CURSO */}
      <div className="curso-header">
        <img className="curso-header-bg" src={bgImage} alt="" />
        <div className="curso-header-info">
          <h2>{curso.nombreCurso}</h2>
          <p>{curso.categoria}</p>
          <p>Nivel: {curso.nivel}</p>
        </div>

        {/* Panel Interactivo Exclusivo De Alumnos / Estudiantes matriculados */}
        {tipo === "alumno" && (
          <div className="curso-header-botones">
            <p>
              <strong>Valoración: </strong>
              {/* Botón de Feedback Positivo a la Asignatura Global */}
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

              {/* Botón de Feedback Negativo a la Asignatura Global */}
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
              {/* Opción para indexar rápidamente la materia a favoritos */}
              <button
                className="btn-favorito"
                onClick={() => handleLike("favorito")}
              >
                {registroUser?.favorito ? "★ Favorito" : "☆ Favorito"}
              </button>
              {/* Switch de matriculado / des-matriculado */}
              <button
                className="btn-apuntarme"
                onClick={() => handleLike("apuntado")}
              >
                {registroUser?.apuntado ? "✔ Apuntado" : "Apuntarme"}
              </button>
            </p>
          </div>
        )}

        {/* Panel Interactivo Simplificado exclusivo para Profesores Autorizados */}
        {tipo === "profesor" && (
          <div className="curso-header-botones">
            <p>
              <strong>Valoración: {curso.valoracion || 0}</strong>
            </p>
          </div>
        )}
      </div>

      {/* SECCIÓN B: REPOSITORIO DE CONTENIDO ESTRUCTURAL (EL GRID PRINCIPAL) */}
      <div className="curso-contenedor-principal">
        {/* Columna Izquierda (Ancha): Tarjetas Multimedia */}
        <div className="contenido-curso">
          <h3>Contenido del curso</h3>

          {/* Bloque: VÍDEOS DEL CURSO */}
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

          {/* Bloque: APUNTES TEÓRICOS Y DOCUMENTOS */}
          <h4>Apuntes</h4>
          <div className="apuntes-columns-wrapper">
            {/* Sub-Columna Módulos de Cátedra Oficial */}
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
                <p className="sin-contenido">Sin apuntes.</p>
              )}
            </div>

            {/* Sub-Columna Archivos Comunitarios Ajenos a Institución */}
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
                <p className="sin-contenido">Sin apuntes.</p>
              )}
            </div>
          </div>

          {/* Bloque: EJERCICIOS Y TAREAS */}
          <h4>Ejercicios</h4>
          {contenidos.ejercicios.length > 0 ? (
            <div className="ejercicios-list">
              {contenidos.ejercicios.map((e) => (
                <div key={e.id} className="ejercicio-row">
                  {/* Aspecto estático y descriptor del planteamiento del profesor */}
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

                  {/* Aspecto reactivo según sea Docente o Discente (Evaluador / Evaluado) */}
                  <div className="ejercicio-row-boton">
                    {tipo === "profesor" ? ( // Vista del Profesor (Recoger los boletínes y evaluar)
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
                      // Vista Integral Resolutiva Alumno (Chequeo Entregas Y Calificaciones Retornadas)
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
                              {/* ¿Lo envié o no lo envié? Cambia el Botón central del Formulario Data */}
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

                              {/* Despliegue de la calificación si estuviere provista por el docente evaluador */}
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
        </div>

        {/* SECCIÓN C: BARRA LATERAL (SIDEBAR DE APOYO FORMATIVO) */}
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

                  {/* Lógica Render Mixta: Lectura Plana vs Input Text Area para Modificación del Draft In-situ */}
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

                      {/* Opciones De Modificado / Borrado si y solamente si Yo Mismo creé este ID de Comentario */}
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

            {/* Emisión de aportes para matriculados / Alumnos */}
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

      {/* SECCIÓN D: BOTÓN FLOTANTE OMNIPRESENTE (ACCIONES MASIVAS GLOBALES) */}
      {(tipo === "profesor" || tipo === "alumno") && (
        <div className="fixed-action-group">
          {/* Activa el flag global "editingMode" desprotegiendo los bloqueos y permitiendo tachar/borrar o reingresar IDs del CRUD general*/}
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
            {/* Gatillo Master Flotante Inferior Derecho */}
            <button
              className={`subirContenidoCurso${rotado ? " rotated" : ""}`}
              onClick={() => {
                setRotado((prev) => !prev);
                if (tipo === "alumno") {
                  // Alumno solo aporta Apuntes
                  navigate(`/Home/Cursos/${id}/AddContenidoCurso`, {
                    state: { tipo: "apunte", cursoId: id },
                  });
                } else {
                  // El profesor abre el Sub-Menú Radial
                  setShowAddMenu(!showAddMenu);
                }
              }}
              title="Añadir contenido"
            >
              <img src={Mas} alt="Añadir contenido" />
            </button>

            {/* Menú Desplegable Flotante Subyacente y Exclusivo (Admin Power) */}
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

// ==========================================
// 11. EXPORTACIONES MÓDULO
// ==========================================
export default CursoGrid;
