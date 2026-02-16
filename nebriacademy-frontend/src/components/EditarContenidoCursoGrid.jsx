import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Componente: EditarContenidoCursoGrid
 * Permite editar contenido (video, apunte, ejercicio) de un curso.
 */
function EditarContenidoCursoGrid() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { tipo, item, cursoId } = state || {};

  const [nombre, setNombre] = useState(item?.nombre || "");
  const [descripcion, setDescripcion] = useState(item?.descripcion || "");
  const [newFile, setNewFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tipo || !item) {
      navigate(`/Home/Cursos/${cursoId || ""}`);
    }
  }, [tipo, item, navigate, cursoId]);

  const getEndpoint = () => {
    if (tipo === "video") return "videos";
    if (tipo === "apunte") return "apuntes";
    return "ejercicios";
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = getEndpoint();
      const url = `http://localhost:3000/${endpoint}/${item.id}`;

      let respuesta;
      if (newFile) {
        const form = new FormData();
        form.append("nombre", nombre);
        if (tipo !== "video") form.append("descripcion", descripcion);
        form.append("archivo", newFile);

        respuesta = await fetch(url, { method: "PUT", body: form });
      } else {
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

      navigate(`/Home/Cursos/${cursoId}`);
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
        <p>
          <strong>Archivo actual:</strong>{" "}
          {item.archivo ? (
            <a
              href={`http://localhost:3000/${getEndpoint()}/files/${item.archivo}`}
              target="_blank"
              rel="noreferrer"
            >
              {item.archivo}
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
            onClick={() => navigate(`/Home/Cursos/${cursoId}`)}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditarContenidoCursoGrid;
