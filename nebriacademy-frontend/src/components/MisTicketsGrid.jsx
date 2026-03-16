import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
function MisTicketsGrid() {
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
      const res = await fetch(`http://localhost:3000/incidencias/mis-tickets/${user.id}`);
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
    <div>
      <h1>Mis Tickets</h1>
      <p>Aquí puedes ver todos los reportes que has enviado al equipo de soporte.</p>

      {loading && <p>Cargando tickets...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && tickets.length === 0 && (
        <p>No has enviado ningún ticket todavía.</p>
      )}

      {!loading && tickets.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Ticket</th>
              <th>Asunto</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Creado</th>
              <th>Última actualización</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr
                key={t.key}
                onClick={() => navigate(`/Home/MisTickets/${t.key}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{t.key}</td>
                <td>{t.resumen}</td>
                <td>{t.estado}</td>
                <td>{t.prioridad || "—"}</td>
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

export default MisTicketsGrid;
