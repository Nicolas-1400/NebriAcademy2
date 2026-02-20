// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useState, useRef } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import flecha from "../assets/flecha-correcta.png";
import TarjetaFondos from "./TarjetaFondos";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// Formulario complejo para la creación de un nuevo curso.
// Permite definir la metadata del curso y, opcionalmente, adjuntar contenido inicial (apunte, vídeo, ejercicio).
function AddCursoGrid() {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================

  // Datos base del curso
  const [nombreCurso, setNombreCurso] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nivel, setNivel] = useState("");
  const [imagen, setImagen] = useState("Foto1");

  // Contenido opcional: Apunte
  const [fileApunte, setFileApunte] = useState(null);
  const [descripcionApunte, setDescripcionApunte] = useState("");
  const [nombreApunte, setNombreApunte] = useState("");

  // Contenido opcional: Vídeo
  const [fileVideo, setFileVideo] = useState(null);
  const [nombreVideo, setNombreVideo] = useState("");

  // Contenido opcional: Ejercicio
  const [fileEjercicio, setFileEjercicio] = useState(null);
  const [descripcionEjercicio, setDescripcionEjercicio] = useState("");
  const [nombreEjercicio, setNombreEjercicio] = useState("");

  // Feedback de la UI
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Referencias para reiniciar los inputs de tipo file tras un envío exitoso
  const fileInputRef = useRef(null);
  const fileVideoInputRef = useRef(null);
  const fileEjercicioInputRef = useRef(null);

  const navigate = useNavigate();
  const usuarioStore = useAuthStore((state) => state.user);

  // ==========================================
  // 4. FUNCIONES Y HANDLERS
  // ==========================================

  // Helper asíncrono genérico para subir archivos multimedia adjuntos al backend
  const uploadContent = async (endpoint, file, metadata) => {
    if (!file) return;

    const form = new FormData();
    form.append("archivo", file);

    // Inyecta dinámicamente cualquier metadata adicional (ID autor, ID curso, descripciones)
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
      throw error;
    }
  };

  // Orquesta la creación del curso y la subida concurrente de todos los archivos anexados
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones de campos obligatorios
    if (!nombreCurso || !categoria || !descripcion || !nivel) {
      return setError("Rellena todos los campos obligatorios del curso");
    }

    // Validaciones de contenido: Si se adjunta archivo, debe especificarse un nombre
    if (fileApunte && !nombreApunte.trim())
      return setError("El apunte requiere un nombre");
    if (fileVideo && !nombreVideo.trim())
      return setError("El video requiere un nombre");
    if (fileEjercicio && !nombreEjercicio.trim())
      return setError("El ejercicio requiere un nombre");

    try {
      const profesorId = usuarioStore?.id;

      // PASO 1: Creación del Curso Base
      const respuestaCurso = await fetch("http://localhost:3000/cursos/add", {
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

      // Se recupera el ID insertado para vincular los contenidos
      const courseId =
        datosCurso.id || datosCurso.idCurso || datosCurso.cursoId;

      // PASO 2: Preparación de subidas opcionales concurrentes
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

      // PASO 3: Ejecución en paralelo de los adjuntos prometidos
      const results = await Promise.allSettled(uploads);

      // Evalúa si alguna de las subidas secundarias falló
      const errors = results.filter(
        (resultado) => resultado.status === "rejected",
      );

      if (errors.length > 0) {
        setError("Curso creado, pero hubo errores al subir algunos anexos.");
      } else {
        setSuccess("Curso y contenidos creados correctamente");

        // Reseteo del formulario
        setNombreCurso("");
        setCategoria("");
        setDescripcion("");
        setNivel("");
        setImagen("Foto1");

        setFileApunte(null);
        setNombreApunte("");
        setDescripcionApunte("");

        setFileVideo(null);
        setNombreVideo("");

        setFileEjercicio(null);
        setNombreEjercicio("");
        setDescripcionEjercicio("");

        // Reseteo físico de ref inputs
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

  // ==========================================
  // 5. RENDERIZADO
  // ==========================================
  return (
    <div className="perfil-curso">
      <div className="form-add-curso">
        <h3>Crear Curso</h3>

        <form onSubmit={handleSubmit}>
          <div className="contenedor-contenidos">
            <div className="line-1">
              {/* === SECCIÓN: DATOS BÁSICOS DEL CURSO === */}
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

              {/* === SECCIÓN: SUBIDA DE APUNTE OPCIONAL === */}
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
                  <label>Archivo (.pdf, .doc, .docx, .ppt, .pptx)</label>
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
            </div>

            <div className="line-2">
              {/* === SECCIÓN: SUBIDA DE VÍDEO OPCIONAL === */}
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

              {/* === SECCIÓN: SUBIDA DE EJERCICIO OPCIONAL === */}
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
                    onChange={(e) =>
                      setFileEjercicio(e.target.files[0] || null)
                    }
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
            </div>

            {/* === PORTADA DEL CURSO === */}
            <TarjetaFondos selectedImage={imagen} onSelect={setImagen} />

            {/* === ACCIONES Y FEEDBACK === */}
            <div className="botones-cont">
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
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 6. EXPORTACIONES
// ==========================================
export default AddCursoGrid;
