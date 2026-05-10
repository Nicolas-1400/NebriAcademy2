import { API_URL } from "../../../config/api";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/useAuthStore";
import useToastStore from "../../../store/toastStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
function TicketDetailGrid() {
  const { issueKey } = useParams();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [archivosAdjuntar, setArchivosAdjuntar] = useState([]);
  const [subiendoAdjuntos, setSubiendoAdjuntos] = useState(false);
  const [mensajeAdjuntos, setMensajeAdjuntos] = useState("");

  useEffect(() => {
    fetchTicket();
  }, [issueKey]);

  const fetchTicket = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/jira/ticket/${issueKey}`);
      const data = await res.json();
      if (res.ok) {
        setTicket(data);
      } else {
        setError(data.error || "Error al cargar el ticket");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarComentario = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;
    setEnviandoComentario(true);
    try {
      const res = await fetch(`${API_URL}/jira/ticket/${issueKey}/comentario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto: nuevoComentario,
          usuario_nombre: user
            ? `${user.nombre || ""} ${user.apellidos || ""}`.trim()
            : "Usuario",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTicket((prev) => ({
          ...prev,
          comentarios: [...prev.comentarios, data],
        }));
        setNuevoComentario("");
        addToast("Comentario enviado", "success");
      } else {
        addToast(data.error || "Error al enviar el comentario", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Error de conexión con el servidor", "error");
    } finally {
      setEnviandoComentario(false);
    }
  };

  const handleSubirAdjuntos = async (e) => {
    e.preventDefault();
    if (!archivosAdjuntar || archivosAdjuntar.length === 0) return;
    setSubiendoAdjuntos(true);
    setMensajeAdjuntos("");
    try {
      const formData = new FormData();
      for (const archivo of archivosAdjuntar) {
        formData.append("archivos", archivo);
      }
      const res = await fetch(`${API_URL}/jira/ticket/${issueKey}/adjunto`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        // Añadimos los nuevos adjuntos al estado local sin recargar
        setTicket((prev) => ({
          ...prev,
          adjuntos: [...(prev.adjuntos || []), ...data.adjuntos],
        }));
        setArchivosAdjuntar([]);
        setMensajeAdjuntos(
          `${data.adjuntos.length} archivo(s) subido(s) correctamente.`,
        );
      } else {
        setMensajeAdjuntos(data.error || "Error al subir los archivos");
      }
    } catch (err) {
      console.error(err);
      setMensajeAdjuntos("Error de conexión con el servidor");
    } finally {
      setSubiendoAdjuntos(false);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "—";
    return new Date(fecha).toLocaleString("es-ES");
  };

  if (loading) return <p>Cargando ticket...</p>;
  if (error) return <p>{error}</p>;
  if (!ticket) return null;

  return (
    <div className="container-detail-ticket-grid">
      <div className="detail-ticket-left">
        <button
          className="button-submit"
          onClick={() => navigate("/Home/MyTickets")}
        >
          ← Volver a Mis Tickets
        </button>

        <h1>{ticket.resumen}</h1>
        <div className="info-ticket">
          <p>
            <strong>Estado: </strong>
            <span
              className={`ticket-status ${(() => {
                switch ((ticket.estado || "").toLowerCase()) {
                  case "por hacer":
                    return "to-do";
                  case "en curso":
                    return "in-progress";
                  case "esperando al cliente":
                    return "waiting-for-client";
                  case "resuelto":
                    return "resolved";
                  default:
                    return "";
                }
              })()}`}
            >
              {ticket.estado}
            </span>
          </p>
          <p>
            <strong>Creado: </strong>
            {formatFecha(ticket.creado)}
          </p>
          <p>
            <strong>Última actualización: </strong>
            {formatFecha(ticket.actualizado)}
          </p>
        </div>

        <h2>Descripción</h2>
        <pre>{ticket.descripcion}</pre>

        <h2>Archivos adjuntos</h2>

        {(ticket.adjuntos || []).length === 0 && (
          <p className="no-tickets">Este ticket no tiene archivos adjuntos.</p>
        )}

        {(ticket.adjuntos || []).length > 0 && (
          <ul>
            {ticket.adjuntos.map((a) => (
              <li key={a.id}>
                <a href={a.url} target="_blank" rel="noopener noreferrer">
                  {a.nombre}
                </a>
              </li>
            ))}
          </ul>
        )}

        <h3>Adjuntar nuevos archivos</h3>
        <form onSubmit={handleSubirAdjuntos}>
          <input
            className="upload-files"
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            onChange={(e) => setArchivosAdjuntar(Array.from(e.target.files))}
          />
          <br />
          <button
            className="button-submit"
            type="submit"
            disabled={subiendoAdjuntos || archivosAdjuntar.length === 0}
          >
            {subiendoAdjuntos ? "Subiendo..." : "Subir archivos"}
          </button>
          {mensajeAdjuntos && (
            <p className="attached-message">{mensajeAdjuntos}</p>
          )}
        </form>
      </div>
      <div className="detail-ticket-chat">
        <h2>Chat</h2>
        <div className="chat-comments">
          {ticket.comentarios.length === 0 && (
            <p className="no-tickets">Aún no hay comentarios en este ticket.</p>
          )}
          {ticket.comentarios.map((c) => {
            // Los mensajes del alumno se guardan en Jira bajo la cuenta "nebriacademy"
            // y llevan el prefijo "Nombre Apellido: " en el texto.
            // Visualmente mostramos "Usted" como autor y eliminamos ese prefijo.
            const esMio = c.autor?.toLowerCase().includes("nebriacademy");
            const autorVisible = esMio
              ? user
                ? `${user.nombre || ""} ${user.apellidos || ""}`.trim()
                : "Usted"
              : c.autor;
            const textoVisible = esMio
              ? c.texto.replace(/^[^:]+:\s*/, "")
              : c.texto;

            return (
              <div key={c.id} className="chat-message">
                <div className="chat-header">
                  {autorVisible}
                  <span className="chat-date">{formatFecha(c.fecha)}</span>
                </div>
                <div className="chat-text">{textoVisible}</div>
              </div>
            );
          })}
        </div>
        <h3>Responder</h3>
        <form onSubmit={handleEnviarComentario} className="chat-form">
          <textarea
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            placeholder="Escribe tu respuesta..."
            rows={4}
            required
          />
          <br />
          <button
            className="button-submit"
            type="submit"
            disabled={enviandoComentario}
          >
            {enviandoComentario ? "Enviando..." : "Enviar comentario"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TicketDetailGrid;
