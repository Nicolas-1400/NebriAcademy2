// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../config/api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Formulario para editar un apunte existente. Los datos del apunte llegan en el state de navegación.
function EditarApunteIndividualGrid() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { apunte } = state || {};

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  // Precargamos los campos con los datos actuales del apunte
  const [nombre, setNombre] = useState(apunte?.nombre || "");
  const [descripcion, setDescripcion] = useState(apunte?.descripcion || "");
  // El archivo es opcional: si no se selecciona uno nuevo, se mantiene el actual
  const [newFile, setNewFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Si llegamos a esta página sin datos del apunte, redirigimos a la lista de apuntes
  useEffect(() => {
    if (!apunte) {
      navigate("/Home/Apuntes");
    }
  }, [apunte, navigate]);

  // Envía los cambios al backend: con FormData si hay nuevo archivo, o con JSON si no
  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_URL}/apuntes/${apunte.id}`;

      let respuesta;
      if (newFile) {
        // Si se seleccionó un archivo nuevo, enviamos todo como FormData (multipart)
        const form = new FormData();
        form.append("nombre", nombre);
        form.append("descripcion", descripcion);
        form.append("archivo", newFile);

        respuesta = await fetch(url, { method: "PUT", body: form });
      } else {
        // Si no hay archivo nuevo, enviamos solo texto como JSON
        const body = { nombre, descripcion };

        respuesta = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (!respuesta.ok) {
        const datos = await respuesta.json();
        throw new Error(datos.error || "Error actualizando apunte");
      }

      navigate("/Home/Apuntes");
    } catch (error) {
      console.error(error);
      setError(error.message || "Error al guardar cambios");
    } finally {
      setLoading(false);
    }
  };

  if (!apunte) return <p>Cargando...</p>;

  return (
    <div className="editar-curso-container">
      <h2>Editar Apunte</h2>
      <div className="add-contenido-form">
        {/* Enlace al archivo actual para que el usuario pueda verlo antes de reemplazarlo */}
        <p>
          <strong>Archivo actual:</strong>{" "}
          {apunte.archivo ? (
            <a
              href={`${API_URL}/apuntes/files/${apunte.archivo}`}
              target="_blank"
              rel="noreferrer"
            >
              {apunte.archivo}
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

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Cambiar archivo (opcional)</label>
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

        <div className="form-botones">
          <button className="btn-subir" onClick={handleSave} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button
            className="btn-cancel"
            onClick={() => navigate("/Home/Apuntes")}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditarApunteIndividualGrid;
