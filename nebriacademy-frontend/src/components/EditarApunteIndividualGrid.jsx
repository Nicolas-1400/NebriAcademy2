import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Componente: EditarApunteIndividualGrid
 * Permite editar un apunte individual (fuera del contexto de un curso concreto).
 */
function EditarApunteIndividualGrid() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { apunte } = state || {};

  const [nombre, setNombre] = useState(apunte?.nombre || "");
  const [descripcion, setDescripcion] = useState(apunte?.descripcion || "");
  const [newFile, setNewFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!apunte) {
      navigate("/Home/Apuntes");
    }
  }, [apunte, navigate]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `http://localhost:3000/apuntes/${apunte.id}`;

      let respuesta;
      if (newFile) {
        const form = new FormData();
        form.append("nombre", nombre);
        form.append("descripcion", descripcion);
        form.append("archivo", newFile);

        respuesta = await fetch(url, { method: "PUT", body: form });
      } else {
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
        <p>
          <strong>Archivo actual:</strong>{" "}
          {apunte.archivo ? (
            <a
              href={`http://localhost:3000/apuntes/files/${apunte.archivo}`}
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
          <small style={{ color: "#666" }}>
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
