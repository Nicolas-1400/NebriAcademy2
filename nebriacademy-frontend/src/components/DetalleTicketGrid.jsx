import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

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
        // Añadimos el comentario nuevo al estado local sin recargar todo
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

  const formatFecha = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("es-ES");
  };

  if (loading) return <p>Cargando ticket...</p>;
  if (error) return <p>{error}</p>;
  if (!ticket) return null;

  return (
    <div>
      <button onClick={() => navigate("/Home/MisTickets")}>← Volver a Mis Tickets</button>

      <h1>{ticket.key}: {ticket.resumen}</h1>

      <p><strong>Estado:</strong> {ticket.estado}</p>
      <p><strong>Prioridad:</strong> {ticket.prioridad || "—"}</p>
      <p><strong>Creado:</strong> {formatFecha(ticket.creado)}</p>
      <p><strong>Última actualización:</strong> {formatFecha(ticket.actualizado)}</p>

      <hr />

      <h2>Descripción</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{ticket.descripcion}</pre>

      {ticket.adjuntos && ticket.adjuntos.length > 0 && (
        <>
          <hr />
          <h2>Archivos adjuntos</h2>
          <ul>
            {ticket.adjuntos.map((a) => (
              <li key={a.id}>
                <a href={a.url} target="_blank" rel="noopener noreferrer">
                  {a.nombre}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <hr />

      <h2>Comentarios ({ticket.comentarios.length})</h2>

      {ticket.comentarios.length === 0 && (
        <p>Aún no hay comentarios en este ticket.</p>
      )}

      {ticket.comentarios.map((c) => (
        <div key={c.id}>
          <p>
            <strong>{c.autor}</strong> — {formatFecha(c.fecha)}
          </p>
          <p>{c.texto}</p>
          <hr />
        </div>
      ))}

      <h3>Responder</h3>
      <form onSubmit={handleEnviarComentario}>
        <textarea
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          placeholder="Escribe tu respuesta..."
          rows={4}
          required
        />
        <br />
        <button type="submit" disabled={enviandoComentario}>
          {enviandoComentario ? "Enviando..." : "Enviar comentario"}
        </button>
      </form>
    </div>
  );
}

export default DetalleTicketGrid;
