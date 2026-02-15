import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

/**
 * Componente: AddContenidoCursoGrid
 * Permite subir nuevos materiales (Apuntes, Videos, Ejercicios) a un curso existente.
 */
function AddContenidoCursoGrid() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user: usuario, tipo: tipoUsuario } = useAuthStore();

  // Resolución de ID del curso y Tipo de contenido
  const cursoId = state?.cursoId || (id && Number(id) > 0 ? Number(id) : null);
  const initialTipo =
    tipoUsuario !== "profesor" ? "apunte" : state?.tipo || "apunte";

  const [tipo, setTipo] = useState(initialTipo);
  const [categoria, setCategoria] = useState("");

  // Estado del formulario
  const [file, setFile] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar categoría del curso
  // Efecto para cargar la categoría del curso automáticamente
  // Esto asegura que el contenido nuevo herede la categoría del curso al que pertenece
  useEffect(() => {
    if (cursoId) {
      fetch(`http://localhost:3000/cursos/${cursoId}`)
        .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
        .then((datos) => datos && setCategoria(datos.categoria))
        .catch((error) => console.error("Error cargando curso:", error));
    }
  }, [cursoId]);

  // Maneja el envío del formulario
  // Determina el endpoint correcto según el tipo de contenido (video, apunte, ejercicio)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validación básica: El usuario debe haber seleccionado un archivo
    if (!file) {
      setLoading(false);
      return setError("Debes seleccionar un archivo");
    }
    if (!nombre.trim()) {
      setLoading(false);
      return setError("El nombre es obligatorio");
    }

    try {
      // Selección del endpoint de la API basado en el tipo de contenido
      const getEndpoint = () => {
        if (tipo === "video") return "videos";
        if (tipo === "apunte") return "apuntes";
        if (tipo === "ejercicio") return "ejercicios";
        return ""; // Caso por defecto para evitar errores si el tipo es desconocido
      };

      const endpoint = getEndpoint();

      const form = new FormData();
      // Añadimos los campos comunes a todos los tipos de contenido
      form.append("nombre", nombre);
      form.append("archivo", file);
      form.append("curso", cursoId);
      if (categoria) form.append("categoria", categoria);

      // Campos específicos por tipo
      if (tipo !== "video") form.append("descripcion", descripcion);

      // Autor: Dependiendo del endpoint, se espera 'autor' o 'usuarioId'
      // Vincular al profesor logueado
      if (usuario) {
        form.append("autor", usuario.id);
        // Si es un ejercicio, necesitamos asociarlo explícitamente al ID del profesor (usuarioId en la tabla ejercicios)
        if (tipo === "ejercicio" && usuario.usuarioId) {
          form.append("usuarioId", usuario.usuarioId);
        }
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

export default AddContenidoCursoGrid;
