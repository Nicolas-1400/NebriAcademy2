// ── IMPORTACIONES ───────────────────────────────────────────────────────────
import { useParams } from "react-router-dom";
import Header from "../../components/layout/Header/Header.jsx";
import RegisterGrid from "../../components/auth/RegisterGrid/RegisterGrid.jsx";

// ── COMPONENTE ──────────────────────────────────────────────────────────────
// Página de registro: pasa el tipo de rol (alumno/profesor) al grid de registro
function Register() {
  const { tipo } = useParams();

  return (
    <div>
      <Header />
      <RegisterGrid tipo={tipo} />
    </div>
  );
}

export default Register;
