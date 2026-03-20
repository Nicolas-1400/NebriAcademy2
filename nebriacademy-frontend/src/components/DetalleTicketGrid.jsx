import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import "../styles/DetalleTicket.css";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
function DetalleTicketGrid() {
  const { issueKey } = useParams();
  const { user } = useAuthStore();
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
      const res = await fetch(`http://localhost:3000/incidencias/ticket/${issueKey}`);
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
      const res = await fetch(`http://localhost:3000/incidencias/ticket/${issueKey}/comentario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texto: nuevoComentario,
          usuario_nombre: user ? `${user.nombre || ""} ${user.apellidos || ""}`.trim() : "Usuario"
        })
      });
      const data = await res.json();
      if (res.ok) {
        setTicket(prev => ({
          ...prev,
          comentarios: [...prev.comentarios, data]
        }));
        setNuevoComentario("");
      } else {
        alert(data.error || "Error al enviar el comentario");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
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
      const res = await fetch(`http://localhost:3000/incidencias/ticket/${issueKey}/adjunto`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        // Añadimos los nuevos adjuntos al estado local sin recargar
        setTicket(prev => ({
          ...prev,
          adjuntos: [...(prev.adjuntos || []), ...data.adjuntos]
        }));
        setArchivosAdjuntar([]);
        setMensajeAdjuntos(`${data.adjuntos.length} archivo(s) subido(s) correctamente.`);
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

  const formatFecha = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("es-ES");
  };

  if (loading) return <p>Cargando ticket...</p>;
  if (error) return <p>{error}</p>;
  if (!ticket) return null;

  return (
    <div className="contenedor-detalle-ticket-grid">
      <div className="detalle-ticket-left">
        <button 
          className="btn-submit"
          onClick={() => navigate("/Home/MisTickets")}>← Volver a Mis Tickets
        </button>

        <h1>{ticket.key}: {ticket.resumen}</h1>
        <div className="info-ticket">
          <p><strong>Estado: </strong><span className={
          `estado-ticket ${(() => {
            switch ((ticket.estado || "").toLowerCase()) {
              case "por hacer":
                return "por-hacer";
              case "en curso":
                return "en-curso";
              case "esperando al cliente":
                return "esperando-cliente";
              case "resuelto":
                return "resuelto";
              default:
                return "";
            }
          })()}`
        }>{ticket.estado}</span></p>
        {/* <p>Prioridad: {ticket.prioridad || "—"}</p> */}
        <p><strong>Creado: </strong>{formatFecha(ticket.creado)}</p>
        <p><strong>Última actualización: </strong>{formatFecha(ticket.actualizado)}</p>
        </div>

        <h2>Descripción</h2>
        <pre>{ticket.descripcion}</pre>

        <h2>Archivos adjuntos {/* ({(ticket.adjuntos || []).length}) */}</h2>

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
            className="subir-archivos"
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            onChange={(e) => setArchivosAdjuntar(Array.from(e.target.files))}
          />
          <br />
          <button className="btn-submit" type="submit" disabled={subiendoAdjuntos || archivosAdjuntar.length === 0}>
            {subiendoAdjuntos ? "Subiendo..." : "Subir archivos"}
          </button>
          {mensajeAdjuntos && <p className="mensaje-adjuntos">{mensajeAdjuntos}</p>}
        </form>
      </div>
      <div className="detalle-ticket-chat">
        <h2>Chat {/* {ticket.comentarios.length} nº de mensajes */}</h2>
        <div className="chat-comentarios">
          {ticket.comentarios.length === 0 && (
            <p className="no-tickets">Aún no hay comentarios en este ticket.</p>
          )}
          {ticket.comentarios.map((c) => (
            <div key={c.id} className="mensaje-chat">
              <div className="chat-header">
                {c.autor}
                <span className="chat-fecha">{formatFecha(c.fecha)}</span>
              </div>
              <div className="chat-texto">{c.texto}</div>
            </div>
          ))}
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
          <button className="btn-submit" type="submit" disabled={enviandoComentario}>
            {enviandoComentario ? "Enviando..." : "Enviar comentario"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DetalleTicketGrid;
