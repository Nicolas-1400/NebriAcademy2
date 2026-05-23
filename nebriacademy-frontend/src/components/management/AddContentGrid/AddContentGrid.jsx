// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../config/api";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../../store/useAuthStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Componente para añadir contenido (vídeos, apuntes, ejercicios) a cursos o subir apuntes de forma individual.
function AddContentGrid({ tipo, idCurso }) {
  const { id: idParam } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user: usuario, tipo: tipoUsuario } = useAuthStore();

  // ── LOGICA DE CONTEXTO ──────────────────────────────────────────────────────
  const isCourseContent = tipo === "curso";
  const idToUse = idCurso || idParam;

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const cursoId = isCourseContent
    ? state?.cursoId ||
      (idToUse && Number(idToUse) > 0 ? Number(idToUse) : null)
    : null;

  // El tipo inicial depende de si es curso (puede ser video/ejercicio) o individual (solo apunte)
  const initialTipo = isCourseContent
    ? tipoUsuario !== "profesor"
      ? "apunte"
      : state?.tipo || "apunte"
    : "apunte";

  const [tipoContenido, setTipoContenido] = useState(initialTipo);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
  });
  const [file, setFile] = useState(null);
  const [categorias, setCategorias] = useState([]); // Para selector en modo individual
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Previene envíos duplicados al subir contenido (apuntes/vídeos/ejercicios).
  const locksRef = useRef({});
  const acquireLock = (key, delay = 800) => {
    if (locksRef.current[key]) return false;
    locksRef.current[key] = true;
    setTimeout(() => delete locksRef.current[key], delay);
    return true;
  };

  // ── EFECTOS ─────────────────────────────────────────────────────────────────

  // Caso 1: Contenido de CURSO (Cargamos categoría del curso automáticamente)
  useEffect(() => {
    if (isCourseContent && cursoId) {
      fetch(`${API_URL}/cursos/${cursoId}`)
        .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
        .then((datos) => {
          if (datos && datos.categoria) {
            setFormData((prev) => ({ ...prev, categoria: datos.categoria }));
          }
        })
        .catch((error) => console.error("Error cargando curso:", error));
    }
  }, [isCourseContent, cursoId]);

  // Caso 2: Contenido INDIVIDUAL (Cargamos lista de categorías para el selector)
  useEffect(() => {
    if (!isCourseContent) {
      fetch(`${API_URL}/apuntes/categorias`)
        .then((respuesta) => respuesta.json())
        .then((datos) =>
          setCategorias(
            Array.isArray(datos.categorias) ? datos.categorias : [],
          ),
        )
        .catch((error) => console.error("Error cargando categorias:", error));
    }
  }, [isCourseContent]);

  // ── FUNCIONES ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acquireLock(`addcontent-${isCourseContent ? `course-${cursoId}` : "individual"}`)) return;
    setLoading(true);
    setError(null);

    if (!file) {
      setLoading(false);
      return setError("Debes seleccionar un archivo");
    }
    if (!formData.nombre.trim()) {
      setLoading(false);
      return setError("El nombre es obligatorio");
    }

    // Evitar que un administrador suba ejercicios a un curso (UX + permisos)
    if (isCourseContent && tipoContenido === "ejercicio" && tipoUsuario === "administrador") {
      setLoading(false);
      return setError("Los administradores no pueden subir ejercicios a cursos");
    }

    try {
      // Determinamos el endpoint según el tipo de contenido
      // endpoint: 'videos' | 'apuntes' | 'ejercicios' (coincide con rutas del backend)
      let endpoint = "";
      if (tipoContenido === "video") endpoint = "videos";
      else if (tipoContenido === "apunte") endpoint = "apuntes";
      else if (tipoContenido === "ejercicio") endpoint = "ejercicios";

      const form = new FormData();
      // Adjuntamos los campos obligatorios al FormData que se enviará al backend
      form.append("nombre", formData.nombre);
      form.append("archivo", file);

      if (isCourseContent && cursoId) {
        form.append("curso", cursoId);
      }

      if (formData.categoria) {
        form.append("categoria", formData.categoria);
      }

      // Los vídeos no suelen tener descripción en el modelo actual
      if (tipoContenido !== "video") {
        form.append("descripcion", formData.descripcion);
      }

      // Información de autoría
      // Añadimos identificadores de autor para que el backend asocie el contenido
      if (usuario) {
        form.append("profileId", usuario.id);
        form.append("tipo", tipoUsuario);
      }

      const respuesta = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        body: form,
      });

      if (!respuesta.ok) {
        const datosError = await respuesta.json().catch(() => ({}));
        throw new Error(datosError.error || "Error subiendo archivo");
      }

      // Redirección tras éxito
      if (isCourseContent && cursoId) {
        navigate(`/Home/Courses/${cursoId}`);
      } else {
        navigate(-1);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message || "Error al subir el contenido");
    } finally {
      setLoading(false);
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────────────────

  return (
    <div className="add-content-grid">
      <h2>
        {isCourseContent
          ? `Añadir ${tipoContenido} al curso`
          : "Añadir apuntes"}
      </h2>

      <form onSubmit={handleSubmit} className="add-content-form">
        <div className="form-group">
          <label>Nombre</label>
          <input
            className="input-area"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            required
          />
        </div>

        {/* La descripción se oculta para vídeos según la lógica previa */}
        {tipoContenido !== "video" && (
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
            />
          </div>
        )}

        <div className="form-group">
          <label>
            Archivo{" "}
            {tipoContenido === "video"
              ? "(se aceptan .mp4, .mov, .avi, .mkv, .wmv y .webm) (máximo 100 MB)"
              : "(se aceptan .txt, .pdf, .doc, .docx, .pptx, .xls, .xlsx, .zip y .rar) (máximo 10 MB)"
            }
          </label>
          <input
            className="input-area"
            type="file"
            accept={
              tipoContenido === "video"
                ? ".mp4, .mov, .avi, .mkv, .wmv, .webm"
                : ".txt, .pdf, .doc, .docx, .pptx, .xls, .xlsx, .zip, .rar"
            }
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <div className="form-group">
          <label>Categoría</label>
          {isCourseContent ? (
            // En curso, la categoría es fija y viene del curso
            <input className="input-area" value={formData.categoria} disabled />
          ) : (
            // En individual, se selecciona de la lista
            <select
              className="input-area"
              value={formData.categoria}
              onChange={(e) =>
                setFormData({ ...formData, categoria: e.target.value })
              }
            >
              <option value="">-- Selecciona categoría --</option>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>

        {error && <p className="error">{error}</p>}

        <div className="form-buttons">
          <button type="submit" className="upload-btn" disabled={loading}>
            {loading ? "Subiendo..." : "Subir"}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddContentGrid;
