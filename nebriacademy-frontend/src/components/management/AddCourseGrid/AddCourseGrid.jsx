// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../config/api";
import { useState, useRef } from "react";
import useAuthStore from "../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import ArrowCorrect from "../../../assets/Icons/arrow-correct.png";
import CourseBackgroundCard from "../../catalogs/Courses/CourseBackgroundCard/CourseBackgroundCard";
import "./AddCourseGrid.css";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Formulario para que el profesor cree un nuevo curso con contenido inicial opcional
function AddCourseGrid() {
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // Campos del curso principal
  const [nombreCurso, setNombreCurso] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nivel, setNivel] = useState("");
  const [imagen, setImagen] = useState("photo1");

  // Campos del apunte inicial del curso (opcional)
  const [fileApunte, setFileApunte] = useState(null);
  const [descripcionApunte, setDescripcionApunte] = useState("");
  const [nombreApunte, setNombreApunte] = useState("");

  // Campos del vídeo inicial del curso (opcional)
  const [fileVideo, setFileVideo] = useState(null);
  const [nombreVideo, setNombreVideo] = useState("");

  // Campos del ejercicio inicial del curso (opcional)
  const [fileEjercicio, setFileEjercicio] = useState(null);
  const [descripcionEjercicio, setDescripcionEjercicio] = useState("");
  const [nombreEjercicio, setNombreEjercicio] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Referencias a los inputs de tipo file para poder limpiarlos tras el envío exitoso
  const fileInputRef = useRef(null);
  const fileVideoInputRef = useRef(null);
  const fileEjercicioInputRef = useRef(null);

  const navigate = useNavigate();
  const usuarioStore = useAuthStore((state) => state.user);

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Sube un archivo de contenido a un endpoint concreto con los metadatos dados
  const uploadContent = async (endpoint, file, metadata) => {
    if (!file) return;

    const form = new FormData();
    form.append("archivo", file);
    Object.keys(metadata).forEach((key) => form.append(key, metadata[key]));

    try {
      const respuesta = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        body: form,
      });
      if (!respuesta.ok) {
        console.error(`Error subiendo ${endpoint}:`, respuesta.status);
        throw new Error(`Falló la subida de ${endpoint}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Crea el curso y luego sube en paralelo el contenido inicial (apunte, vídeo y ejercicio) si se proporcionó
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nombreCurso || !categoria || !descripcion || !nivel) {
      return setError("Rellena todos los campos obligatorios del curso");
    }

    // Si el profesor ha adjuntado un archivo de contenido, también debe rellenar su nombre
    if (fileApunte && !nombreApunte.trim())
      return setError("El apunte requiere un nombre");
    if (fileVideo && !nombreVideo.trim())
      return setError("El video requiere un nombre");
    if (fileEjercicio && !nombreEjercicio.trim())
      return setError("El ejercicio requiere un nombre");

    try {
      setSubmitting(true);
      const profesorId = usuarioStore?.id;

      if (!profesorId) {
        return setError(
          "No se ha podido identificar al profesor. Por favor, inicia sesión de nuevo.",
        );
      }

      // Primero creamos el curso para obtener su ID
      const respuestaCurso = await fetch(`${API_URL}/cursos/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCurso,
          categoria,
          descripcion,
          nivel,
          profesor: profesorId,
          imagen,
        }),
      });

      const datosCurso = await respuestaCurso.json();
      if (!respuestaCurso.ok)
        throw new Error(datosCurso.error || "Error al crear curso");

      const courseId =
        datosCurso.id || datosCurso.idCurso || datosCurso.cursoId;

      // Construimos la lista de subidas de contenido inicial
      const uploads = [];

      if (fileApunte) {
        uploads.push(
          uploadContent("apuntes", fileApunte, {
            autor: profesorId,
            profileId: profesorId,
            tipo: "profesor",
            curso: courseId,
            nombre: nombreApunte,
            descripcion: descripcionApunte,
            categoria: categoria,
          }),
        );
      }

      if (fileVideo) {
        uploads.push(
          uploadContent("videos", fileVideo, {
            autor: profesorId,
            profileId: profesorId,
            tipo: "profesor",
            curso: courseId,
            nombre: nombreVideo,
          }),
        );
      }

      if (fileEjercicio) {
        uploads.push(
          uploadContent("ejercicios", fileEjercicio, {
            autor: profesorId,
            profileId: profesorId,
            tipo: "profesor",
            curso: courseId,
            nombre: nombreEjercicio,
            descripcion: descripcionEjercicio,
          }),
        );
      }

      // Subimos todos los contenidos en paralelo; con allSettled no abortamos si uno falla
      const results = await Promise.allSettled(uploads);
      const errors = results.filter(
        (resultado) => resultado.status === "rejected",
      );

      if (errors.length > 0) {
        setError(
          `Curso creado, pero hubo errores al subir algunos contenidos.`,
        );
      } else {
        setSuccess("Curso y contenidos creados correctamente");

        // Limpiamos todos los campos del formulario tras la creación exitosa
        setNombreCurso("");
        setCategoria("");
        setDescripcion("");
        setNivel("");
        setImagen("photo1");
        setFileApunte(null);
        setNombreApunte("");
        setDescripcionApunte("");
        setFileVideo(null);
        setNombreVideo("");
        setFileEjercicio(null);
        setNombreEjercicio("");
        setDescripcionEjercicio("");

        // Limpiamos los inputs de tipo file manualmente mediante refs
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (fileVideoInputRef.current) fileVideoInputRef.current.value = "";
        if (fileEjercicioInputRef.current)
          fileEjercicioInputRef.current.value = "";

        setTimeout(() => setSuccess(""), 5000);
      }
    } catch (error) {
      console.error(error);
      setError(error.message || "Error de conexión con el servidor");
    } finally {
      // Mantener el botón desactivado 5 segundos tras el envío para evitar duplicados
      setTimeout(() => setSubmitting(false), 5000);
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="course-management-wrapper">
      <div className="add-course-container">
        <h3>Crear Curso</h3>
        <form onSubmit={handleSubmit}>
          <div className="content-container">
            <div className="line-1">
              {/* Sección de datos obligatorios del curso */}
              <div className="course-info-section">
                <div className="form-group">
                  <label>Nombre del curso *</label>
                  <input
                    type="text"
                    value={nombreCurso}
                    onChange={(e) => setNombreCurso(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Selecciona categoría
                    </option>
                    <option value="Programación">Programación</option>
                    <option value="Diseño y UX">Diseño y UX</option>
                    <option value="Ciberseguridad">Ciberseguridad</option>
                    <option value="BDD">Base de datos</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Inteligencia Artificial">
                      Inteligencia Artificial
                    </option>
                    <option value="Desarrollo">Desarrollo</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nivel *</label>
                  <select
                    value={nivel}
                    onChange={(e) => setNivel(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Selecciona nivel
                    </option>
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    className="description-textarea"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Sección opcional para añadir un apunte inicial al crear el curso */}
              <div className="notes-section">
                <h4>Añadir Apunte (Opcional)</h4>
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={nombreApunte}
                    onChange={(e) => setNombreApunte(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>
                    Archivo (.pdf, .doc, .docx, .ppt, .pptx) (máximo 20 MB)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    onChange={(e) => setFileApunte(e.target.files[0] || null)}
                  />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    className="description-textarea"
                    value={descripcionApunte}
                    onChange={(e) => setDescripcionApunte(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="line-2">
              {/* Sección opcional para añadir un vídeo inicial al crear el curso */}
              <div className="video-section">
                <h4>Añadir Video (Opcional)</h4>
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={nombreVideo}
                    onChange={(e) => setNombreVideo(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Archivo (Video) (máximo 20 MB)</label>
                  <input
                    type="file"
                    ref={fileVideoInputRef}
                    accept="video/*"
                    onChange={(e) => setFileVideo(e.target.files[0] || null)}
                  />
                </div>
              </div>

              {/* Sección opcional para añadir un ejercicio inicial al crear el curso */}
              <div className="exercises-section">
                <h4>Añadir Ejercicio (Opcional)</h4>
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={nombreEjercicio}
                    onChange={(e) => setNombreEjercicio(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Archivo (.zip, .pdf...) (máximo 20 MB)</label>
                  <input
                    type="file"
                    ref={fileEjercicioInputRef}
                    accept=".pdf,.doc,.docx,.zip,.rar"
                    onChange={(e) =>
                      setFileEjercicio(e.target.files[0] || null)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <input
                    type="text"
                    value={descripcionEjercicio}
                    onChange={(e) => setDescripcionEjercicio(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Galería de imágenes para elegir la portada del curso */}
            <CourseBackgroundCard selectedImage={imagen} onSelect={setImagen} />

            <div className="action-buttons-container">
              {success && <p className="success-message">{success}</p>}
              {error && <p className="error-message">{error}</p>}

              <button
                type="submit"
                className="submit-button"
                disabled={submitting}
              >
                {submitting ? "Creando..." : "Crear curso"}
              </button>
              <button
                type="button"
                className="back-button"
                onClick={() => navigate("/Home")}
              >
                <img src={ArrowCorrect} alt="Volver" />
                <p>Volver</p>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCourseGrid;
