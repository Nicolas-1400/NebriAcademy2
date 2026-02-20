// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// Formulario para la adición de recursos (apuntes, ejercicios, videos) a un curso existente.
function AddContenidoCursoGrid() {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================

  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const { user: usuario, tipo: tipoUsuario } = useAuthStore();

  const cursoId = state?.cursoId || (id && Number(id) > 0 ? Number(id) : null);
  const initialTipo =
    tipoUsuario !== "profesor" ? "apunte" : state?.tipo || "apunte";

  const [tipo, setTipo] = useState(initialTipo);
  const [categoria, setCategoria] = useState("");

  const [file, setFile] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // 4. EFECTOS
  // ==========================================
  useEffect(() => {
    if (cursoId) {
      fetch(`http://localhost:3000/cursos/${cursoId}`)
        .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
        .then((datos) => datos && setCategoria(datos.categoria))
        .catch((error) => console.error("Error cargando curso:", error));
    }
  }, [cursoId]);

  // ==========================================
  // 5. FUNCIONES Y HANDLERS
  // ==========================================

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

      if (tipo !== "video") form.append("descripcion", descripcion);

      if (usuario) {
        form.append("profileId", usuario.id);
        form.append("tipo", tipoUsuario);
      }

      const respuesta = await fetch(`http://localhost:3000/${endpoint}`, {
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

  // ==========================================
  // 6. RENDERIZADO
  // ==========================================
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
          <label>Archivo</label>
          <input
            className="input-area"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>

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

// ==========================================
// 7. EXPORTACIONES
// ==========================================
export default AddContenidoCursoGrid;
