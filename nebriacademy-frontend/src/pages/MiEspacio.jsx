import Nav from "../components/Nav";
import MiEspacioGrid from "../components/MiEspacioGrid";
import Footer from "../components/Footer";

/**
 * Página de Mi Espacio para alumnos
 * Muestra los cursos en los que está inscrito el alumno
 */
function MiEspacio() {
  return (
    <div>
      <Nav />
      <MiEspacioGrid />
      <Footer />
    </div>
  );
}

export default MiEspacio;
