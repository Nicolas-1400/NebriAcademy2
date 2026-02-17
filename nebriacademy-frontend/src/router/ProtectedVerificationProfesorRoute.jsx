import { Navigate, useLocation } from "react-router-dom";

/**
 * Componente: ProtectedVerificationProfesorRoute
 * Protege la ruta de registro de profesores.
 * Verifica si existe un email verificado en sessionStorage o en el estado de navegación.
 * Si no existe, redirige al usuario a la página de verificación de profesores.
 */
function ProtectedVerificationProfesorRoute({ children }) {
  const location = useLocation();
  const verifiedEmail = sessionStorage.getItem("verifiedProfessorEmail");
  const stateEmail = location.state?.email;

  // Si no hay email verificado ni en storage ni en el estado, redirigir
  if (!verifiedEmail && !stateEmail) {
    return <Navigate to="/Register/VerificacionProfesor" replace />;
  }

  return children;
}

export default ProtectedVerificationProfesorRoute;
