import { Navigate, useLocation } from "react-router-dom";

// Componente de Ruta Protegida (Verificación Alumno)
function ProtectedVerificationRoute({ children }) {
  const location = useLocation();
  const verifiedEmail = sessionStorage.getItem("verifiedStudentEmail");
  const stateEmail = location.state?.email;

  // Verificación de Email
  if (!verifiedEmail && !stateEmail) {
    return <Navigate to="/Register/VerificacionAlumnoNebrija" replace />;
  }

  // Renderizado
  return children;
}

export default ProtectedVerificationRoute;
