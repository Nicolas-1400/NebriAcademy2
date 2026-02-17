import { Navigate, useLocation } from "react-router-dom";

/**
 * Componente: ProtectedVerificationRoute
 * Protege la ruta de registro de alumnos.
 * Verifica si existe un email verificado en sessionStorage o en el estado de navegación.
 * Si no existe, redirige al usuario a la página de verificación de email.
 */
function ProtectedVerificationRoute({ children }) {
  const location = useLocation();
  const verifiedEmail = sessionStorage.getItem("verifiedStudentEmail");
  const stateEmail = location.state?.email;

  // Si no hay email verificado ni en storage ni en el estado, redirigir
  if (!verifiedEmail && !stateEmail) {
    return <Navigate to="/Register/VerificacionAlumnoNebrija" replace />;
  }

  return children;
}

export default ProtectedVerificationRoute;
