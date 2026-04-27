import { Navigate, useLocation } from "react-router-dom";

// Protege la ruta de registro de alumnos Nebrija.
// Solo se puede acceder si antes se completó la verificación del email (se guarda en sessionStorage o en el state de navegación).
function ProtectedVerificationRoute({ children }) {
  const location = useLocation();

  // Comprobamos si el email verificado está en sessionStorage o viene en el state de la navegación anterior
  const verifiedEmail = sessionStorage.getItem("verifiedStudentEmail");
  const stateEmail = location.state?.email;

  // Si no hay ninguno de los dos, el usuario no ha pasado por verificación: lo redirigimos
  if (!verifiedEmail && !stateEmail) {
    return <Navigate to="/Register/Verificacion/alumnoexterno" replace />;
  }

  return children;
}

export default ProtectedVerificationRoute;
