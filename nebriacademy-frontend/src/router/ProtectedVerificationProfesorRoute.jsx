import { Navigate, useLocation } from "react-router-dom";

function ProtectedVerificationProfesorRoute({ children }) {
  const location = useLocation();
  const verifiedEmail = sessionStorage.getItem("verifiedProfessorEmail");
  const stateEmail = location.state?.email;

  if (!verifiedEmail && !stateEmail) {
    return <Navigate to="/Register/VerificacionProfesor" replace />;
  }

  return children;
}

export default ProtectedVerificationProfesorRoute;
