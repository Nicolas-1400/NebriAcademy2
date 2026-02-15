import RegisterAlumnoNebrijaGrid from "../components/RegisterAlumnoNebrijaGrid.jsx";
import Header from "../components/Header.jsx";

/**
 * Página de registro para alumnos de la Universidad Nebrija
 * Formulario de registro para estudiantes verificados de Nebrija
 */
function Register() {
  return (
    <div>
      <Header />
      <RegisterAlumnoNebrijaGrid />
    </div>
  );
}

export default Register;
