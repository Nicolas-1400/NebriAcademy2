import Nav from "../components/Nav";
import InfoProfesorGrid from "../components/InfoProfesorGrid";
import Footer from "../components/Footer";

/**
 * Página de información detallada de un profesor
 * Muestra el perfil completo del profesor y sus cursos
 */
function InfoProfesor() {
  return (
    <div>
      <Nav />
      <InfoProfesorGrid />
      <Footer />
    </div>
  );
}

export default InfoProfesor;
