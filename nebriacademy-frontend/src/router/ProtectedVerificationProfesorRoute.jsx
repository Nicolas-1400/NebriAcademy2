import { Navigate, useLocation } from "react-router-dom";

// Protege la ruta de registro de profesores.
// Solo se puede acceder si antes se completó la verificación del email de profesor (guardada en sessionStorage o en el state de navegación).
function ProtectedVerificationProfesorRoute({ children }) {
  const location = useLocation();

  // Comprobamos si el email verificado está en sessionStorage o viene en el state de la navegación anterior
  const verifiedEmail = sessionStorage.getItem("verifiedProfessorEmail");
  const stateEmail = location.state?.email;

  // Si no hay ninguno de los dos, el usuario no ha pasado por verificación: lo redirigimos
  if (!verifiedEmail && !stateEmail) {
    return <Navigate to="/Register/Verificacion/profesor" replace />;
  }

  return children;
}

export default ProtectedVerificationProfesorRoute;
