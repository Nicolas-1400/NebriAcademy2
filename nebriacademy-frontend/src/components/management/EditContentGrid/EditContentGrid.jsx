// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../config/api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Formulario genérico para editar vídeos, apuntes o ejercicios de un curso.
// El tipo de contenido y los datos actuales llegan en el state de navegación.
function EditContentGrid() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { tipo, item, cursoId } = state || {};

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // Precargamos los campos con los valores actuales del contenido
  const [nombre, setNombre] = useState(item?.nombre || "");
  const [descripcion, setDescripcion] = useState(item?.descripcion || "");
  // El archivo es opcional: si no se selecciona uno nuevo, se mantiene el actual
  const [newFile, setNewFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Si llegamos sin datos del contenido, redirigimos
  useEffect(() => {
    if (!tipo || !item) {
      if (cursoId) {
        navigate(`/Home/Courses/${cursoId}`);
      } else {
        navigate("/Home/Notes");
      }
    }
  }, [tipo, item, navigate, cursoId]);

  // Determina el endpoint de la API según el tipo de contenido que se está editando
  const getEndpoint = () => {
    if (tipo === "video") return "videos";
    if (tipo === "apunte") return "apuntes";
    return "ejercicios";
  };

  // Envía los cambios al backend: con FormData si hay nuevo archivo, o con JSON si no
  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = getEndpoint();
      const url = `${API_URL}/${endpoint}/${item.id}`;

      let respuesta;
      if (newFile) {
        // Si se seleccionó un archivo nuevo, enviamos todo como FormData (multipart)
        const form = new FormData();
        form.append("nombre", nombre);
        if (tipo !== "video") form.append("descripcion", descripcion);
        form.append("archivo", newFile);

        respuesta = await fetch(url, { method: "PUT", body: form });
      } else {
        // Si no hay archivo nuevo, enviamos solo texto como JSON
        const body = { nombre };
        if (tipo !== "video") body.descripcion = descripcion;

        respuesta = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!respuesta.ok) {
        const datos = await respuesta.json();
        throw new Error(datos.error || "Error actualizando contenido");
      }

      if (cursoId) {
        navigate(`/Home/Courses/${cursoId}`);
      } else {
        navigate("/Home/Notes");
      }
    } catch (error) {
      console.error(error);
      setError(error.message || "Error al guardar cambios");
    } finally {
      setLoading(false);
    }
  };

  if (!item) return <p>Cargando...</p>;

  return (
    <div className="editar-curso-container">
      <h2>Editar {tipo}</h2>
      <div className="add-contenido-form">
        {/* Enlace al archivo actual para que el usuario pueda verlo antes de reemplazarlo */}
        <p>
          <strong>Archivo actual:</strong>{" "}
          {item.archivo ? (
            <a href={item.archivo} target="_blank" rel="noreferrer">
              Ver archivo actual
            </a>
          ) : (
            "Sin archivo"
          )}
        </p>

        <div className="form-group">
          <label>Nombre</label>
          <input
            className="input-area"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        {/* El campo descripción no aplica a los vídeos */}
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
          <label>Cambiar archivo (opcional) (máximo 20 MB)</label>
          <input
            className="input-area"
            type="file"
            onChange={(e) => setNewFile(e.target.files?.[0] || null)}
          />
          <small className="file-help-text">
            Si subes un nuevo archivo, reemplazará al actual.
          </small>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="form-buttons">
          <button
            className="button-subir"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            className="button-cancel"
            onClick={() => {
              if (cursoId) {
                navigate(`/Home/Courses/${cursoId}`);
              } else {
                navigate("/Home/Notes");
              }
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditContentGrid;
