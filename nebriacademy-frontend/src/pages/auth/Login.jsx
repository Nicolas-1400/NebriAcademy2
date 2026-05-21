// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import LoginGrid from "../../components/auth/LoginGrid/LoginGrid.jsx";
import Header from "../../components/layout/Header/Header.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de inicio de sesión: monta Header + LoginGrid
function Login() {
  return (
    <div>
      <Header />
      <LoginGrid />
    </div>
  );
}

export default Login;
