import { useState, useRef } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import flecha from "../assets/flecha-correcta.png";

/**
 * Componente: AddCursoGrid
 * Formulario completo para crear curso y contenido inicial opcional.
 */
function AddCursoGrid() {
  // --- Estados del Curso ---
  const [nombreCurso, setNombreCurso] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nivel, setNivel] = useState("");

  // --- Estados de Contenidos Opcionales ---
  const [fileApunte, setFileApunte] = useState(null);
  const [descripcionApunte, setDescripcionApunte] = useState("");
  const [nombreApunte, setNombreApunte] = useState("");

  const [fileVideo, setFileVideo] = useState(null);
  const [nombreVideo, setNombreVideo] = useState("");

  const [fileEjercicio, setFileEjercicio] = useState(null);
  const [descripcionEjercicio, setDescripcionEjercicio] = useState("");
  const [nombreEjercicio, setNombreEjercicio] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Referencias para resetear inputs de archivo
  const fileInputRef = useRef(null);
  const fileVideoInputRef = useRef(null);
  const fileEjercicioInputRef = useRef(null);

  const navigate = useNavigate();
  const usuarioStore = useAuthStore((state) => state.user);

  /**
   * Helper privado para subir contenido adicional (apunte, video, ejercicio).
   */
  const uploadContent = async (endpoint, file, metadata) => {
    if (!file) return; // Si no hay archivo, no hacer nada (no es error)

    const form = new FormData();
    form.append("archivo", file);
    Object.keys(metadata).forEach((key) => form.append(key, metadata[key]));

    try {
      const respuesta = await fetch(`http://localhost:3000/${endpoint}`, {
        method: "POST",
        body: form,
      });
      if (!respuesta.ok) {
        console.error(`Error subiendo ${endpoint}:`, respuesta.status);
        throw new Error(`Falló la subida de ${endpoint}`);
      }
    } catch (error) {
      console.error(error);
      // Propagamos el error para avisar al usuario
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nombreCurso || !categoria || !descripcion || !nivel) {
      return setError("Rellena todos los campos obligatorios del curso");
    }

    // Validaciones de contenido opcional (Consistencia)
    if (fileApunte && !nombreApunte.trim())
      return setError("El apunte requiere un nombre");
    if (fileVideo && !nombreVideo.trim())
      return setError("El video requiere un nombre");
    if (fileEjercicio && !nombreEjercicio.trim())
      return setError("El ejercicio requiere un nombre");

    try {
      const profesorId = usuarioStore?.id;

      // 1. Crear Curso
      const respuestaCurso = await fetch("http://localhost:3000/cursos/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombreCurso,
          categoria,
          descripcion,
          nivel,
          profesor: profesorId,
        }),
      });

      const datosCurso = await respuestaCurso.json();
      if (!respuestaCurso.ok)
        throw new Error(datosCurso.error || "Error al crear curso");

      const courseId =
        datosCurso.id || datosCurso.idCurso || datosCurso.cursoId;

      // 2. Subir contenidos opcionales en paralelo (Promise.allSettled para no detener todo por un fallo parcial)
      const uploads = [];

      // Apunte
      if (fileApunte) {
        uploads.push(
          uploadContent("apuntes", fileApunte, {
            autor: profesorId,
            curso: courseId,
            nombre: nombreApunte,
            descripcion: descripcionApunte,
          }),
        );
      }

      // Video
      if (fileVideo) {
        uploads.push(
          uploadContent("videos", fileVideo, {
            autor: profesorId,
            curso: courseId,
            nombre: nombreVideo,
          }),
        );
      }

      // Ejercicio
      if (fileEjercicio) {
        uploads.push(
          uploadContent("ejercicios", fileEjercicio, {
            autor: profesorId,
            curso: courseId,
            nombre: nombreEjercicio,
            descripcion: descripcionEjercicio,
          }),
        );
      }

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

        // Limpiar formulario tras éxito
        setNombreCurso("");
        setCategoria("");
        setDescripcion("");
        setNivel("");
        setFileApunte(null);
        setNombreApunte("");
        setDescripcionApunte("");
        setFileVideo(null);
        setNombreVideo("");
        setFileEjercicio(null);
        setNombreEjercicio("");
        setDescripcionEjercicio("");

        if (fileInputRef.current) fileInputRef.current.value = "";
        if (fileVideoInputRef.current) fileVideoInputRef.current.value = "";
        if (fileEjercicioInputRef.current)
          fileEjercicioInputRef.current.value = "";

        setTimeout(() => setSuccess(""), 5000);
      }
    } catch (error) {
      console.error(error);
      setError(error.message || "Error de conexión con el servidor");
    }
  };

  return (
    <div className="perfil-curso">
      <div className="formularioEditarPerfil">
        <h3>Crear Curso</h3>
        <form onSubmit={handleSubmit}>
          {/* --- Datos del Curso --- */}
          <div className="curso-cont">
            <div className="formulario-grupo">
              <label>Nombre del curso *</label>
              <input
                type="text"
                value={nombreCurso}
                onChange={(e) => setNombreCurso(e.target.value)}
                required
              />
            </div>
            <div className="formulario-grupo">
              <label>Categoría *</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              >
                <option value="" disabled>
                  Selecciona categoría
                </option>
                <option value="Programacion">Programación</option>
                <option value="Diseño">Diseño</option>
                <option value="Ciberseguridad">Ciberseguridad</option>
                <option value="BDD">Base de datos</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>
            <div className="formulario-grupo">
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
            <div className="formulario-grupo">
              <label>Descripción *</label>
              <textarea
                className="descripcion-textarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>
          </div>

          {/* --- Apunte Opcional --- */}
          <div className="apuntes-cont">
            <h4>Añadir Apunte (Opcional)</h4>
            <div className="formulario-grupo">
              <label>Nombre</label>
              <input
                type="text"
                value={nombreApunte}
                onChange={(e) => setNombreApunte(e.target.value)}
              />
            </div>
            <div className="formulario-grupo">
              <label>Archivo (.pdf, .doc...)</label>
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={(e) => setFileApunte(e.target.files[0] || null)}
              />
            </div>
            <div className="formulario-grupo">
              <label>Descripción</label>
              <textarea
                className="descripcion-textarea"
                value={descripcionApunte}
                onChange={(e) => setDescripcionApunte(e.target.value)}
              />
            </div>
          </div>

          {/* --- Video Opcional --- */}
          <div className="video-cont">
            <h4>Añadir Video (Opcional)</h4>
            <div className="formulario-grupo">
              <label>Nombre</label>
              <input
                type="text"
                value={nombreVideo}
                onChange={(e) => setNombreVideo(e.target.value)}
              />
            </div>
            <div className="formulario-grupo">
              <label>Archivo (Video)</label>
              <input
                type="file"
                ref={fileVideoInputRef}
                accept="video/*"
                onChange={(e) => setFileVideo(e.target.files[0] || null)}
              />
            </div>
          </div>

          {/* --- Ejercicio Opcional --- */}
          <div className="ejercicio-cont">
            <h4>Añadir Ejercicio (Opcional)</h4>
            <div className="formulario-grupo">
              <label>Nombre</label>
              <input
                type="text"
                value={nombreEjercicio}
                onChange={(e) => setNombreEjercicio(e.target.value)}
              />
            </div>
            <div className="formulario-grupo">
              <label>Archivo (.zip, .pdf...)</label>
              <input
                type="file"
                ref={fileEjercicioInputRef}
                accept=".pdf,.doc,.docx,.zip,.rar"
                onChange={(e) => setFileEjercicio(e.target.files[0] || null)}
              />
            </div>
            <div className="formulario-grupo">
              <label>Descripción</label>
              <input
                type="text"
                value={descripcionEjercicio}
                onChange={(e) => setDescripcionEjercicio(e.target.value)}
              />
            </div>
          </div>

          {/* --- Botones --- */}
          <div className="mt-4">
            {success && <p className="mensaje-exito">{success}</p>}
            {error && <p className="mensaje-error">{error}</p>}

            <button type="submit" className="boton-editar-perfil">
              Crear curso
            </button>
            <button
              type="button"
              className="boton-go-back"
              onClick={() => navigate("/Home")}
            >
              <img src={flecha} alt="Volver" />
              <p>Volver</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCursoGrid;
