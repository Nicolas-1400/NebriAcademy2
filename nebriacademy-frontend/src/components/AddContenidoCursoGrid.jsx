// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../config/api";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Formulario para que el profesor suba vídeos, apuntes o ejercicios a un curso concreto
function AddContenidoCursoGrid() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user: usuario, tipo: tipoUsuario } = useAuthStore();

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // El ID del curso puede venir del state de navegación o de los parámetros de la URL
  const cursoId = state?.cursoId || (id && Number(id) > 0 ? Number(id) : null);
  // Si el usuario no es profesor, solo puede subir apuntes
  const initialTipo =
    tipoUsuario !== "profesor" ? "apunte" : state?.tipo || "apunte";

  // tipo indica qué se va a subir: "video", "apunte" o "ejercicio"
  const [tipo, setTipo] = useState(initialTipo);
  // La categoría se autocompleta tomando la del curso al que pertenece el contenido
  const [categoria, setCategoria] = useState("");

  const [file, setFile] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargamos la categoría del curso para asociarla automáticamente al contenido subido
  useEffect(() => {
    if (cursoId) {
      fetch(`${API_URL}/cursos/${cursoId}`)
        .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
        .then((datos) => datos && setCategoria(datos.categoria))
        .catch((error) => console.error("Error cargando curso:", error));
    }
  }, [cursoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!file) {
      setLoading(false);
      return setError("Debes seleccionar un archivo");
    }
    if (!nombre.trim()) {
      setLoading(false);
      return setError("El nombre es obligatorio");
    }

    try {
      // Determinamos el endpoint de la API según el tipo de contenido a subir
      const getEndpoint = () => {
        if (tipo === "video") return "videos";
        if (tipo === "apunte") return "apuntes";
        if (tipo === "ejercicio") return "ejercicios";
        return "";
      };

      const endpoint = getEndpoint();

      const form = new FormData();
      form.append("nombre", nombre);
      form.append("archivo", file);
      form.append("curso", cursoId);
      if (categoria) form.append("categoria", categoria);

      // Los vídeos no tienen descripción en el modelo de datos
      if (tipo !== "video") form.append("descripcion", descripcion);

      // Enviamos el ID del usuario y su tipo para que el backend pueda registrar la autoría
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

      navigate(`/Home/Cursos/${cursoId}`);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message || "Error al subir el contenido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addcontenidocursogrid">
      <h2>Añadir {tipo} al curso</h2>
      <form onSubmit={handleSubmit} className="add-contenido-form">
        <div className="form-group">
          <label>Nombre</label>
          <input
            className="input-area"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        {/* El campo descripción no se muestra para los vídeos */}
        {tipo !== "video" && (
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          {tipo === "video" ? (
            <>
              <label>Archivo (se aceptan .mp4, .mov, .avi, .mkv, .wmv y .webm) (máximo 20 MB)</label>
              <input
                className="input-area"
                type="file"
                accept=".mp4, .mov, .avi, .mkv, .wmv, .webm"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </>
          ) : (
            <>
              <label>Archivo (se aceptan .txt, .pdf, .doc, .docx, .pptx, .xls, .xlsx, .zip y .rar) (máximo 20 MB)</label>
              <input
                className="input-area"
                type="file"
                accept=".txt, .pdf, .doc, .docx, .pptx, .xls, .xlsx, .zip, .rar"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </>
          )}
        </div>

        {/* La categoría viene del curso y no es editable por el usuario */}
        <div className="form-group">
          <label>Categoría</label>
          <input className="input-area" value={categoria} disabled />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="form-botones">
          <button type="submit" className="btn-subir" disabled={loading}>
            {loading ? "Subiendo..." : "Subir"}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddContenidoCursoGrid;
