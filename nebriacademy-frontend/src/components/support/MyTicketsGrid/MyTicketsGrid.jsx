import { API_URL } from "../../../config/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/useAuthStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
function MyTicketsGrid() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    fetchMisTickets();
  }, [user]);

  const fetchMisTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/jira/mis-tickets/${user.id}`);
      const data = await res.json();
      if (res.ok) {
        setTickets(data.tickets || []);
      } else {
        setError(data.error || "Error al cargar los tickets");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("es-ES");
  };

  return (
    <div className="my-tickets-container">
      <h1>Mis Tickets</h1>
      <p className="my-tickets-subtitle">
        Aquí puedes ver todos los reportes que has enviado al equipo de soporte.
      </p>

      {loading && <p className="loading-message">Cargando tickets...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && tickets.length === 0 && (
        <p className="empty-message">
          No se han encontrado tickets reportados.
        </p>
      )}

      {!loading && tickets.length > 0 && (
        <table className="tickets-table">
          <thead className="column-title">
            <tr>
              <th>Asunto</th>
              <th>Estado</th>
              <th>Creado</th>
              <th>Última actualización</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {tickets.map((t) => (
              <tr
                className="ticket-row"
                key={t.key}
                onClick={() => navigate(`/Home/MyTickets/${t.key}`)}
              >
                <td className="td-summary">
                  {(() => {
                    const [primera, ...resto] = t.resumen.split(" ");
                    return (
                      <>
                        <span className="first-word">{primera}</span>
                        {resto.length > 0 ? " " + resto.join(" ") : ""}
                      </>
                    );
                  })()}
                </td>
                <td className="td-status">
                  <span
                    className={`ticket-status ${(() => {
                      switch ((t.estado || "").toLowerCase()) {
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
                    {t.estado}
                  </span>
                </td>
                <td>{formatFecha(t.creado)}</td>
                <td>{formatFecha(t.actualizado)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyTicketsGrid;
