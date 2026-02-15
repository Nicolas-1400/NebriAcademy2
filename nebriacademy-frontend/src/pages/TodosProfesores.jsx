import Nav from "../components/Nav";
import TodosProfesoresGrid from "../components/TodosProfesoresGrid";
import Footer from "../components/Footer";

/**
 * Página que muestra todos los profesores
 * Permite explorar los perfiles de los profesores de la plataforma
 */
function TodosProfesores() {
  return (
    <div>
      <Nav />
      <TodosProfesoresGrid />
      <Footer />
    </div>
  );
}

export default TodosProfesores;
