import Header from "../components/Header";
import RegisterProfesorGrid from "../components/RegisterProfesorGrid";

/**
 * Página de registro para profesores
 * Formulario de registro para docentes que quieren unirse a la plataforma
 */
function RegisterProfesor() {
  return (
    <div>
      <Header />
      <RegisterProfesorGrid />
    </div>
  );
}

export default RegisterProfesor;
