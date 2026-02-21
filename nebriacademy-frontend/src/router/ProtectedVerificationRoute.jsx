import { Navigate, useLocation } from "react-router-dom";

function ProtectedVerificationRoute({ children }) {
  const location = useLocation();
  const verifiedEmail = sessionStorage.getItem("verifiedStudentEmail");
  const stateEmail = location.state?.email;

  if (!verifiedEmail && !stateEmail) {
    return <Navigate to="/Register/VerificacionAlumnoNebrija" replace />;
  }

  return children;
}

export default ProtectedVerificationRoute;
