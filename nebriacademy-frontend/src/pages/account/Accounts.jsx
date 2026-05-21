// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import Footer from "../../components/layout/Footer/Footer.jsx";
import Nav from "../../components/layout/Nav/Nav.jsx";
import AccountsGrid from "../../components/account/AccountsGrid/AccountsGrid.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de gestión de cuentas (solo administrador)
function Accounts() {
  return (
    <div>
      <Nav />
      <AccountsGrid />
      <Footer />
    </div>
  );
}

export default Accounts;
