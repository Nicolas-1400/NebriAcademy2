// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../config/api";
import { useState, useRef } from "react";
import useAuthStore from "../../../store/useAuthStore";
import useToastStore from "../../../store/toastStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Formulario de soporte para que los usuarios envíen incidencias, dudas o sugerencias directamente a Jira.
function HelpGrid() {
  // Datos del usuario (si está logueado) para vincularlos al ticket automáticamente
  const { user, tipo } = useAuthStore();
  const { addToast } = useToastStore();
  
  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const [tipoReporte, setTipoReporte] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState(null);
  
  // Bloqueo del botón de envío mientras se procesa la petición
  const [enviando, setEnviando] = useState(false);
  // Evita envíos duplicados del formulario de ayuda (incidencias).
  const locksRef = useRef({});
  const acquireLock = (key, delay = 800) => {
    if (locksRef.current[key]) return false;
    locksRef.current[key] = true;
    setTimeout(() => delete locksRef.current[key], delay);
    return true;
  };

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Construye un payload multipart (para incluir archivos) y lo envía a la pasarela backend de Jira
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!tipoReporte || !descripcion) {
      addToast("Por favor, rellena todos los campos requeridos.", "error");
      return;
    }

    // Límite de tamaño para evitar errores en el servidor (10MB)
    if (archivo && archivo.size > 10 * 1024 * 1024) {
      addToast("El archivo adjunto no puede superar los 10MB.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("tipo", tipoReporte);
    formData.append("descripcion", descripcion);
    
    // Si hay sesión iniciada, identificamos al usuario en Jira
    if (user) {
      formData.append("usuario_id", user.id || "");
      formData.append(
        "usuario_nombre",
        `${user.nombre || ""} ${user.apellidos || ""}`.trim(),
      );
      formData.append("usuario_tipo", tipo || "");
      formData.append("usuario_email", user.email || "");
    }
    
    if (archivo) {
      formData.append("archivo", archivo);
    }

    if (!acquireLock("help-submit")) return;
    try {
      setEnviando(true);
      const res = await fetch(`${API_URL}/jira`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        addToast("Incidencia enviada correctamente.", "success");
        // Limpiamos los campos para permitir nuevos envíos
        setTipoReporte("");
        setDescripcion("");
        setArchivo(null);
        // Limpieza explícita del input file en el DOM
        const fileInput = document.getElementById("archivoIncidencia");
        if (fileInput) fileInput.value = "";
      } else {
        addToast("Error al enviar la incidencia.", "error");
      }
    } catch (error) {
      console.error(error);
      addToast("Error de conexión con el servidor.", "error");
    } finally {
      setEnviando(false);
    }
  };

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="help-container">
      <h1>Solicita ayuda al equipo de soporte de Nebriacademy</h1>
      <h3>
        ¿Necesitas ayuda con algo?
        <br />
        Escríbenos y resolveremos tu problema lo antes posible.
      </h3>
      <form className="help-form" onSubmit={handleSubmit}>
        <p>
          Selecciona qué quieres reportar
          <select
            className="report-selection"
            name="tipoReporte"
            value={tipoReporte}
            onChange={(e) => setTipoReporte(e.target.value)}
            required
          >
            <option value="" disabled hidden></option>
            <option value="Error">Informar de un error</option>
            <option value="Denuncia">Denunciar un contenido</option>
            <option value="Consulta">Hacer una consulta</option>
            <option value="Sugerencia">Hacer una sugerencia</option>
          </select>
        </p>
        <p>
          Describe el problema o mejora
          <br />
          <textarea
            className="description-container"
            name="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          ></textarea>
        </p>
        <p>
          ¿Tienes alguna imagen, video o documento? Adjúntalo para que podamos
          entender mejor el problema (Máximo 10MB):
          <input
            className="file-selection"
            type="file"
            id="archivoIncidencia"
            onChange={(e) => setArchivo(e.target.files[0])}
          />
        </p>
        <button className="send-button" type="submit" disabled={enviando}>
          Enviar
        </button>
      </form>
      {/* Feedback visual durante el tiempo de petición */}
      {enviando && (
        <span className="sending-text">
          Enviando tu reporte a Jira, espera un momento...
        </span>
      )}
    </div>
  );
}

export default HelpGrid;
