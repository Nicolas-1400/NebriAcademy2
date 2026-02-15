import LoginGrid from "../components/LoginGrid";
import Header from "../components/Header.jsx";

/**
 * Página de inicio de sesión
 * Muestra el header y el formulario de login
 */
function Login() {
  return (
    <div>
      <Header />
      <LoginGrid />
    </div>
  );
}

export default Login;
