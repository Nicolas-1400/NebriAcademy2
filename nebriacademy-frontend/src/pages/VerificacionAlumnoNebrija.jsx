import Header from "../components/Header";
import VerificacionAlumnoNebrijaGrid from "../components/VerificacionAlumnoNebrijaGrid";

/**
 * Página de verificación de alumno de la Universidad Nebrija
 * Valida que el usuario sea estudiante de Nebrija mediante email institucional
 */
function VerificacionAlumnoNebrija() {
  return (
    <div>
      <Header />
      <VerificacionAlumnoNebrijaGrid />
    </div>
  );
}

export default VerificacionAlumnoNebrija;
