import Footer from "../components/Footer";
import Nav from "../components/Nav";
import TodosCursosGrid from "../components/TodosCursosGrid";

/**
 * Página que muestra todos los cursos disponibles
 * Permite a los usuarios explorar y buscar cursos
 */
function TodosCursos() {
  return (
    <div>
      <Nav />
      <TodosCursosGrid />
      <Footer />
    </div>
  );
}

export default TodosCursos;
