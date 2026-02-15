import Nav from "../components/Nav";
import AddContenidoCursoGrid from "../components/AddContenidoCursoGrid";
import Footer from "../components/Footer";

/**
 * Página para añadir contenido a un curso
 * Permite añadir videos, ejercicios y apuntes a un curso existente
 */
function AddContenidoCurso() {
  return (
    <div>
      <Nav />
      <AddContenidoCursoGrid />
      <Footer />
    </div>
  );
}

export default AddContenidoCurso;
