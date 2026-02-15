import Nav from "../components/Nav";
import CursoGrid from "../components/CursoGrid";
import Footer from "../components/Footer";

/**
 * Página de detalle de un curso específico
 * Muestra información completa del curso, contenido, videos, ejercicios y apuntes
 */
function Curso() {
  return (
    <div>
      <Nav />
      <CursoGrid />
      <Footer />
    </div>
  );
}

export default Curso;
