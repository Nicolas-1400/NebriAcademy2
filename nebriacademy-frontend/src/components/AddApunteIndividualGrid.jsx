import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

/**
 * Componente: AddApunteIndividualGrid
 * Permite subir un apunte no asociado a un curso específico.
 */
function AddApunteIndividualGrid() {
  const navigate = useNavigate();
  const { user: usuario, tipo } = useAuthStore();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
  });
  const [file, setFile] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/apuntes/categorias")
      .then((respuesta) => respuesta.json())
      .then((datos) =>
        setCategorias(Array.isArray(datos.categorias) ? datos.categorias : []),
      )
      .catch((error) => console.error("Error cargando categorias:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!file) return setError("Selecciona un archivo");
    if (!formData.nombre.trim()) return setError("El nombre es obligatorio");

    setLoading(true);

    try {
      const form = new FormData();
      form.append("archivo", file);
      form.append("nombre", formData.nombre);
      form.append("descripcion", formData.descripcion);
      if (formData.categoria) form.append("categoria", formData.categoria);

      if (usuario) {
        // Enviar profileId y tipo para que el backend resuelva el usuarioId
        form.append("profileId", usuario.id);
        form.append("tipo", tipo);
      }

      const respuesta = await fetch("http://localhost:3000/apuntes", {
        method: "POST",
        body: form,
      });

      if (!respuesta.ok) {
        const datosError = await respuesta.json();
        throw new Error(datosError.error || "Error subiendo archivo");
      }

      navigate(-1);
    } catch (error) {
      console.error(error);
      setError(error.message || "Error al subir apunte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addcontenidocursogrid">
      <h2>Añadir apunte</h2>
      <form onSubmit={handleSubmit} className="add-contenido-form">
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

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
          />
        </div>

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
          <label>Categoria</label>
          <select
            className="input-area"
            value={formData.categoria}
            onChange={(e) =>
              setFormData({ ...formData, categoria: e.target.value })
            }
          >
            <option value="">-- Selecciona categoria --</option>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
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

export default AddApunteIndividualGrid;
