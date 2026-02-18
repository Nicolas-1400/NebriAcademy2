import { Navigate, useLocation } from "react-router-dom";

// Componente de Ruta Protegida (Verificación Profesor)
function ProtectedVerificationProfesorRoute({ children }) {
  const location = useLocation();
  const verifiedEmail = sessionStorage.getItem("verifiedProfessorEmail");
  const stateEmail = location.state?.email;

  // Verificación de Email
  if (!verifiedEmail && !stateEmail) {
    return <Navigate to="/Register/VerificacionProfesor" replace />;
  }

  // Renderizado
  return children;
}

export default ProtectedVerificationProfesorRoute;
