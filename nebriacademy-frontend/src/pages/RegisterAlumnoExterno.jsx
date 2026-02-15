import Header from "../components/Header";
import RegisterAlumnoExternoGrid from "../components/RegisterAlumnoExternoGrid";

/**
 * Página de registro para alumnos externos (no Nebrija)
 * Formulario de registro para estudiantes de otras instituciones
 */
function RegisterAlumnoExterno() {
  return (
    <div>
      <Header />
      <RegisterAlumnoExternoGrid />
    </div>
  );
}

export default RegisterAlumnoExterno;
