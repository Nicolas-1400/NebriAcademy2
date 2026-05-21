// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Nav from "../../components/layout/Nav/Nav.jsx";
import TicketDetailGrid from "../../components/support/TicketDetailGrid/TicketDetailGrid.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de detalle de un ticket de soporte: hilo de mensajes entre usuario y admin
function TicketDetail() {
  return (
    <div>
      <Nav />
      <TicketDetailGrid />
      <Footer />
    </div>
  );
}

export default TicketDetail;
