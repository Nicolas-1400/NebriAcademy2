// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// EditarApunteIndividualGrid: Panel de actualización de propiedades para un apunte pre-existente.
// Desacoplado de la estructura de cursos, pensado para apuntes genéricos subidos de forma comunitaria.
function EditarApunteIndividualGrid() {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================
  const { state } = useLocation();
  const navigate = useNavigate();
  // El objeto Original es recibido como prop persistente en la matriz de historial (router state)
  const { apunte } = state || {};

  // Formulario de edición basado flexiblemente en el objeto semilla
  const [nombre, setNombre] = useState(apunte?.nombre || "");
  const [descripcion, setDescripcion] = useState(apunte?.descripcion || "");

  // Archivo de Reemplazo (Null por defecto a no ser que el usuario modifique también el adjunto)
  const [newFile, setNewFile] = useState(null);

  // Indicadores funcionales y perceptuales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==========================================
  // 4. EFECTOS
  // ==========================================

  // Seguridad: Evita renderizar un formulario vacío si accedieron sin pasar un apunte vía URL directa
  useEffect(() => {
    if (!apunte) {
      navigate("/Home/Apuntes");
    }
  }, [apunte, navigate]);

  // ==========================================
  // 5. MANEJADORES DE EVENTO
  // ==========================================

  // Serializa los campos en un JSON o un FormData (según corresponda) y los inyecta al endpoint PUT
  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `http://localhost:3000/apuntes/${apunte.id}`;

      let respuesta;

      // Si detecta un recambio físico del documento -> Inyección multipart form-data
      if (newFile) {
        const form = new FormData();
        form.append("nombre", nombre);
        form.append("descripcion", descripcion);
        form.append("archivo", newFile);

        respuesta = await fetch(url, { method: "PUT", body: form });
      }
      // Si la carga útil atiende solamente a Texto -> Formato JSON ligero clásico
      else {
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

      // Conduce de vuelta al directorio de apuntes
      navigate("/Home/Apuntes");
    } catch (error) {
      console.error(error);
      setError(error.message || "Error al guardar cambios");
    } finally {
      // Re-habilita el cursor tras culminar operaciones
      setLoading(false);
    }
  };

  // ==========================================
  // 6. RENDERIZADO AL DOM
  // ==========================================
  if (!apunte) return <p>Cargando...</p>;

  return (
    <div className="editar-curso-container">
      <h2>Editar Apunte</h2>

      <div className="add-contenido-form">
        {/* Helper visual que indica el fichero original alojado */}
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

// ==========================================
// 7. EXPORTACIONES MÓDULO
// ==========================================
export default EditarApunteIndividualGrid;
