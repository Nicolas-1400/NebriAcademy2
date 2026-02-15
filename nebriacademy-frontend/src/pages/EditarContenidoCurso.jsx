import Nav from "../components/Nav.jsx";
import EditarContenidoCursoGrid from "../components/EditarContenidoCursoGrid.jsx";
import Footer from "../components/Footer.jsx";

/**
 * Página para editar el contenido de un curso (solo profesores)
 * Permite modificar videos, ejercicios y apuntes de un curso
 */
function EditarContenidoCurso() {
  return (
    <div>
      <Nav />
      <EditarContenidoCursoGrid />
      <Footer />
    </div>
  );
}

export default EditarContenidoCurso;
