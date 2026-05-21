// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Nav from "../../components/layout/Nav/Nav.jsx";
import HelpGrid from "../../components/support/HelpGrid/HelpGrid.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de soporte: formulario para abrir un nuevo ticket de ayuda
function Help() {
  return (
    <div>
      <Nav />
      <HelpGrid />
      <Footer />
    </div>
  );
}

export default Help;
