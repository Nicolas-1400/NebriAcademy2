// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// AddApunteIndividualGrid: Interfaz que facilita la creación y subida de un Documento (Apunte) independiente.
// Diseñado para funcionar de manera desacoplada a un curso en concreto.
function AddApunteIndividualGrid() {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================
  const navigate = useNavigate();
  // Extracción sincrónica del contexto global de autenticación (rol Alumno/Profesor)
  const { user: usuario, tipo } = useAuthStore();

  // Diccionario reactivo para recopilar los campos de texto del Formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
  });

  // Archivo binario encapsulado por medio del selector HTML
  const [file, setFile] = useState(null);
  // Lista extraída de la BBDD para rellenar las opciones de categorización (select)
  const [categorias, setCategorias] = useState([]);

  // Handlers para User Experience
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // 4. EFECTOS DEL CICLO DE VIDA
  // ==========================================

  // Solicitud asíncrona única durante el montaje para hidratar el `<select>` dinámico
  useEffect(() => {
    fetch("http://localhost:3000/apuntes/categorias")
      .then((respuesta) => respuesta.json())
      .then((datos) =>
        setCategorias(Array.isArray(datos.categorias) ? datos.categorias : []),
      )
      .catch((error) => console.error("Error cargando categorias:", error));
  }, []);

  // ==========================================
  // 5. MANEJADORES DE EVENTOS
  // ==========================================

  // Valida, empaca y despacha la transacción hacia el servidor vía POST
  const handleSubmit = async (e) => {
    // Omite el refresh tradicional de los forms
    e.preventDefault();
    setError(null);

    // Barreras anti-spam (Validación front-end obligatoria)
    if (!file) return setError("Selecciona un archivo");
    if (!formData.nombre.trim()) return setError("El nombre es obligatorio");

    setLoading(true);

    try {
      // Ensamblaje multiparte, permitiendo mezclar textos y un objeto Blob
      const form = new FormData();
      form.append("archivo", file);
      form.append("nombre", formData.nombre);
      form.append("descripcion", formData.descripcion);
      if (formData.categoria) form.append("categoria", formData.categoria);

      if (usuario) {
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

      // Reversión de historial al ser despachado correctamente (Ej. Volver al Feed o Perfil)
      navigate(-1);
    } catch (error) {
      console.error(error);
      setError(error.message || "Error al subir apunte");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // 6. BLOQUE DE RENDERIZADO
  // ==========================================
  return (
    <div className="addcontenidocursogrid">
      <h2>Añadir apuntes</h2>

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
          {/* Adquisición del Fichero Físico - Rescata el elemento en la posición 0 del array del sistema */}
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

        {/* Display de excepciones devueltas */}
        {error && <p className="error">{error}</p>}

        <div className="form-botones">
          {/* Botón discapacitado condicionalmente para evitar duplicados en BBDD durante la latencia */}
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
// 7. EXPORTACIONES MÓDULO
// ==========================================
export default AddApunteIndividualGrid;
