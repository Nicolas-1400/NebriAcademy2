import { useState, useRef } from "react";
import useAuthStore from '../store/useAuthStore'
import { useNavigate } from "react-router-dom";
import "../styles/AddCurso.css";
import flecha from "../assets/flecha-correcta.png";

function AddCursoGrid() {
  const [nombreCurso, setNombreCurso] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nivel, setNivel] = useState("");
  const [fileApunte, setFileApunte] = useState(null);
  const [descripcionApunte, setDescripcionApunte] = useState("");
  const [fileVideo, setFileVideo] = useState(null);
  const [nombreVideo, setNombreVideo] = useState("");
  const [fileEjercicio, setFileEjercicio] = useState(null);
  const [descripcionEjercicio, setDescripcionEjercicio] = useState("");
  const fileInputRef = useRef(null);
  const fileVideoInputRef = useRef(null);
  const fileEjercicioInputRef = useRef(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const usuarioStore = useAuthStore(state => state.user)
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombreCurso || !categoria || !descripcion || !nivel) {
      setError("Rellena todos los campos");
      return;
    }

    try {
      const usuario = usuarioStore || {}
      const profesorId = usuario.id || null;


      const res = await fetch("http://localhost:3000/cursos/add", {
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

      const datos = await res.json();

      if (res.ok) {
        // Determinar courseId una sola vez para usarlo en ambas subidas
        const courseId = datos.id ?? datos.idCurso ?? datos.cursoId ?? datos.id_curso ?? null;
        // Si hay un fichero de apunte, subirlo con FormData al endpoint /apuntes
        try {
          if (fileApunte && courseId) {
            const formData = new FormData();
            formData.append("archivo", fileApunte);
            formData.append("autor", profesorId);
            formData.append("curso", courseId);
            formData.append("descripcion", descripcionApunte);

            const resApunte = await fetch("http://localhost:3000/apuntes", {
              method: "POST",
              body: formData,
            });

            const apunteBody = await resApunte.json().catch(() => null);
            if (!resApunte.ok) {
              console.error("Error al subir apunte:", resApunte.status, apunteBody);
              setError("Error al subir apunte");
            }
          }
        } catch (errUpload) {
          console.error("Error al subir apunte:", errUpload);
          setError("Error al subir apunte");
        }

        // Subir vídeo si existe (nombre y archivo deben ir juntos)
        try {
          if ((nombreVideo && !fileVideo) || (fileVideo && !nombreVideo)) {
            setError("Debes proporcionar nombre del vídeo y fichero juntos");
          } else if (fileVideo && courseId) {
            const formDataV = new FormData();
            formDataV.append("archivo", fileVideo);
            formDataV.append("autor", profesorId);
            formDataV.append("curso", courseId);
            formDataV.append("nombre", nombreVideo);

            const resVideo = await fetch("http://localhost:3000/videos", {
              method: "POST",
              body: formDataV,
            });

            const videoBody = await resVideo.json().catch(() => null);
            if (!resVideo.ok) {
              console.error("Error al subir video:", resVideo.status, videoBody);
              setError("Error al subir vídeo");
            }
          }
        } catch (errV) {
          console.error("Error al subir video:", errV);
          setError("Error al subir vídeo");
        }

        // Subir ejercicio si existe (nombre y archivo deben ir juntos)
        try {
            if ((descripcionEjercicio && !fileEjercicio) || (fileEjercicio && !descripcionEjercicio)) {
            setError("Debes proporcionar descripción del ejercicio y fichero juntos");
          } else if (fileEjercicio && courseId) {
            const formDataE = new FormData();
            formDataE.append("archivo", fileEjercicio);
            formDataE.append("autor", profesorId);
            formDataE.append("curso", courseId);
            formDataE.append("descripcion", descripcionEjercicio);

            const resEjercicio = await fetch("http://localhost:3000/ejercicios", {
              method: "POST",
              body: formDataE,
            });

            const ejercicioBody = await resEjercicio.json().catch(() => null);
            if (!resEjercicio.ok) {
              console.error("Error al subir ejercicio:", resEjercicio.status, ejercicioBody);
              setError("Error al subir ejercicio");
            }
          }
        } catch (errE) {
          console.error("Error al subir ejercicio:", errE);
          setError("Error al subir ejercicio");
        }

        setSuccess("Curso creado correctamente");
        setError("");
        setNombreCurso("");
        setCategoria("");
        setDescripcion("");
        setNivel("");
        setFileApunte(null);
        setDescripcionApunte("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (fileVideoInputRef.current) fileVideoInputRef.current.value = "";
        if (fileEjercicioInputRef.current) fileEjercicioInputRef.current.value = "";
        setFileVideo(null);
        setNombreVideo("");
        setFileEjercicio(null);
        setDescripcionEjercicio("");
        setTimeout(() => setSuccess(""), 6000);
      } else {
        setError(datos.error || "Error al crear curso");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error(err);
    }
  };

  return (
    <div className="perfil-curso">
      <div className="formularioEditarPerfil">
        <h3>Crear Curso</h3>
        <form onSubmit={handleSubmit}>
          <div className="formulario-grupo">
            <label>Nombre del curso</label>
            <input
              type="text"
              placeholder="Nombre del curso"
              value={nombreCurso}
              onChange={(e) => setNombreCurso(e.target.value)}
              required
            />
          </div>

          <div className="formulario-grupo">
            <label>Categoría</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
              <option value="" disabled>
                Selecciona categoría
              </option>
            <option value="Programacion">Programación</option>
            <option value="Diseno">Diseño</option>
            <option value="Ciberseguridad">Ciberseguridad</option>
            <option value="BDD">Base de datos</option>
            <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div className="formulario-grupo">
            <label>Descripción</label>
            <textarea
              className="descripcion-textarea"
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>

          <div className="formulario-grupo">
            <label>Subir apunte (opcional)</label>
            <input
              type="file"
              name="archivo"
              ref={fileInputRef}
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              onChange={(e) => setFileApunte(e.target.files[0] || null)}
            />
          </div>

          <div className="formulario-grupo">
            <label>Descripción del apunte (opcional)</label>
            <textarea
              className="descripcion-textarea"
              placeholder="Descripción del apunte"
              value={descripcionApunte}
              onChange={(e) => setDescripcionApunte(e.target.value)}
            />
          </div>

          <div className="formulario-grupo">
            <label>Subir vídeo (opcional)</label>
            <input
              type="file"
              name="archivo"
              ref={fileVideoInputRef}
              accept="video/*"
              onChange={(e) => setFileVideo(e.target.files[0] || null)}
            />
          </div>

          <div className="formulario-grupo">
            <label>Subir ejercicio (opcional)</label>
            <input
              type="file"
              name="archivo"
              ref={fileEjercicioInputRef}
              accept=".pdf,.doc,.docx,.zip,.rar"
              onChange={(e) => setFileEjercicio(e.target.files[0] || null)}
            />
          </div>

          <div className="formulario-grupo">
            <label>Descripción del ejercicio (opcional)</label>
            <input
              type="text"
              placeholder="Descripción del ejercicio"
              value={descripcionEjercicio}
              onChange={(e) => setDescripcionEjercicio(e.target.value)}
            />
          </div>

          <div className="formulario-grupo">
            <label>Nombre del vídeo (opcional)</label>
            <input
              type="text"
              placeholder="Nombre del vídeo"
              value={nombreVideo}
              onChange={(e) => setNombreVideo(e.target.value)}
            />
          </div>

          <div className="formulario-grupo">
            <label>Nivel</label>
            <select value={nivel} onChange={(e) => setNivel(e.target.value)} required>
              <option value="" disabled>
                Selecciona nivel
              </option>
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

          

          {success ? (
            <p className="mensaje-exito">{success}</p>
          ) : (
            error && <p className="mensaje-error">{error}</p>
          )}
          <button type="submit" className="boton-editar-perfil">Crear curso</button>
          <button className="boton-go-back" onClick={() => navigate('/Home')}>
            <img src={flecha} alt="Volver" />
            <p>Volver</p>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCursoGrid;