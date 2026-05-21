// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Nav from "../../components/layout/Nav/Nav.jsx";
import MyTicketsGrid from "../../components/support/MyTicketsGrid/MyTicketsGrid.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página que muestra el historial de tickets de soporte del usuario
function MyTickets() {
  return (
    <div>
      <Nav />
      <MyTicketsGrid />
      <Footer />
    </div>
  );
}

export default MyTickets;
