import Nav from "../components/Nav";
import AddCursoGrid from "../components/AddCursoGrid";
import Footer from "../components/Footer";

/**
 * Página para añadir un nuevo curso (solo profesores)
 * Permite a los profesores crear cursos en la plataforma
 */
function AddCurso() {
  return (
    <div>
      <Nav />
      <AddCursoGrid />
      <Footer />
    </div>
  );
}

export default AddCurso;
