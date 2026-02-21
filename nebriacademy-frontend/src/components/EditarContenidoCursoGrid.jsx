// ==========================================
// 1. IMPORTACIONES
// ==========================================
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
// EditarContenidoCursoGrid: Formulario universal de re-emisión y edición de recursos.
// Maneja "Videos", "Apuntes" y "Ejercicios" mediante lógica condicional,
// soportando la sobrescritura del objeto binario y su metadata.
function EditarContenidoCursoGrid() {
  // ==========================================
  // 3. ESTADOS Y HOOKS
  // ==========================================
  const { state } = useLocation();
  const navigate = useNavigate();
  // Extracción del payload propagado a través de history/state durante la navegación interna
  const { tipo, item, cursoId } = state || {};

  const [nombre, setNombre] = useState(item?.nombre || "");
  const [descripcion, setDescripcion] = useState(item?.descripcion || "");

  // Alberga la sobrescritura del blob (file) en caso de haber un reemplazo real de datos.
  const [newFile, setNewFile] = useState(null);

  // Control de interfaz y feedback al usuario
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==========================================
  // 4. EFECTOS
  // ==========================================

  // Barrera Preventiva: Si el usuario accediera por URL directa sin state (ej. F5),
  // se le redirige inmediatamente al nivel superior para evitar roturas de UI
  // porque el componente carece de sus variables contextuales base.
  useEffect(() => {
    if (!tipo || !item) {
      navigate(`/Home/Cursos/${cursoId || ""}`);
    }
  }, [tipo, item, navigate, cursoId]);

  // ==========================================
  // 5. FUNCIONES Y MANEJADORES DE EVENTOS
  // ==========================================

  // Helper de enrutamiento: Intersecta el tipo textual semántico de la aplicación
  // con la arquitectura REST real de los controladores backend NodeJS.
  const getEndpoint = () => {
    if (tipo === "video") return "videos";
    if (tipo === "apunte") return "apuntes";
    return "ejercicios";
  };

  // Función núcleo que orquesta la Inserción/Sustitución en servidor.
  // Es asíncrona y transacciona usando FormData solo cuando hay ficheros envueltos,
  // para optimizar el payload a modo json simple si solo se alteró texto.
  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = getEndpoint();
      const url = `http://localhost:3000/${endpoint}/${item.id}`;

      let respuesta;

      // Bifurcación técnica: Subida multiparte estricta requerida si mutó el Binario original
      if (newFile) {
        const form = new FormData();
        form.append("nombre", nombre);
        // Los videos están exentos del campo descripción por diseño de la DB actual (solo Apuntes/Ejercicios lo usan)
        if (tipo !== "video") form.append("descripcion", descripcion);
        form.append("archivo", newFile);

        respuesta = await fetch(url, { method: "PUT", body: form });
      }
      // Subida de Texto Plano (Optimización liviana)
      else {
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

      // Evacuación y regreso a la matriz de curso tras el éxito
      navigate(`/Home/Cursos/${cursoId}`);
    } catch (error) {
      console.error(error);
      setError(error.message || "Error al guardar cambios");
    } finally {
      // Retira estandartes visuales de bloqueo
      setLoading(false);
    }
  };

  // ==========================================
  // 6. BLOQUE DE RENDERIZADO
  // ==========================================

  // Early Return defensivo mientras el efecto re-direccionador opera
  if (!item) return <p>Cargando...</p>;

  return (
    <div className="editar-curso-container">
      <h2>Editar {tipo}</h2>

      <div className="add-contenido-form">
        {/* Banner de Referencia Visual que expone qué archivo pre-existía */}
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

        {/* Campos Editables Transversales */}
        <div className="form-group">
          <label>Nombre</label>
          <input
            className="input-area"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        {/* Campo Específico: Supresión automática para videos por carecer de columna descriptiva en SQL */}
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
          {/* Caza únicamente el primer archivo subido con la API nativa DOM (e.target.files) */}
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

        {/* Controles Definitivos */}
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

// ==========================================
// 7. EXPORTACIONES MÓDULO
// ==========================================
export default EditarContenidoCursoGrid;
