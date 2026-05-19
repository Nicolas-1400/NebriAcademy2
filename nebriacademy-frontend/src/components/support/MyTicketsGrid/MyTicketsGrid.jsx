// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { API_URL } from "../../../config/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/useAuthStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Vista donde el usuario puede consultar el estado de todos sus tickets de soporte (Jira).
function MyTicketsGrid() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // ── ESTADO ─────────────────────────────────────────────────────────────────
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── EFECTOS ───────────────────────────────────────────────────────────────────
  // Si hay un usuario logueado, obtenemos sus tickets desde el backend
  useEffect(() => {
    if (!user?.id) return;
    fetchMisTickets();
  }, [user]);

  // ── FUNCIONES ──────────────────────────────────────────────────────────────────
  // Petición al backend para listar los tickets de Jira asociados al ID del usuario
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

  // Formateador de fechas para mostrar ISO de forma legible (ej: DD/MM/YYYY, HH:mm:ss)
  const formatFecha = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("es-ES");
  };

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="my-tickets-container">
      <h1>Mis Tickets</h1>
      <p className="my-tickets-subtitle">
        Aquí puedes ver todos los reportes que has enviado al equipo de soporte.
      </p>

      {/* Manejo de estados de carga y error */}
      {loading && <p className="loading-message">Cargando tickets...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && tickets.length === 0 && (
        <p className="empty-message">
          No se han encontrado tickets reportados.
        </p>
      )}

      {/* Listado de tickets en formato tabla */}
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
                  {/* Resalta la primera palabra del resumen para darle estilo visual */}
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
