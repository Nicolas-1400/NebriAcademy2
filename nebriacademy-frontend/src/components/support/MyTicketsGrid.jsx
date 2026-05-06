import { API_URL } from "../../config/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

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
    <div className="contenedor-mis-tickets">
      <h1>Mis Tickets</h1>
      <p className="subtitulo">
        Aquí puedes ver todos los reportes que has enviado al equipo de soporte.
      </p>

      {loading && <p className="mensaje-cargando">Cargando tickets...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && tickets.length === 0 && (
        <p className="mensaje-vacio">
          No se han encontrado tickets reportados.
        </p>
      )}

      {!loading && tickets.length > 0 && (
        <table className="tabla-tickets">
          <thead className="titulo-columna">
            <tr>
              <th>Asunto</th>
              <th>Estado</th>
              <th>Creado</th>
              <th>Última actualización</th>
            </tr>
          </thead>
          <tbody className="cuerpo-tabla">
            {tickets.map((t) => (
              <tr
                className="fila-ticket"
                key={t.key}
                onClick={() => navigate(`/Home/MyTickets/${t.key}`)}
              >
                <td className="td-resumen">
                  {(() => {
                    const [primera, ...resto] = t.resumen.split(" ");
                    return (
                      <>
                        <span className="primer-palabra">{primera}</span>
                        {resto.length > 0 ? " " + resto.join(" ") : ""}
                      </>
                    );
                  })()}
                </td>
                <td className="td-estado">
                  <span
                    className={`estado-ticket ${(() => {
                      switch ((t.estado || "").toLowerCase()) {
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
