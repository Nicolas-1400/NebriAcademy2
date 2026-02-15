import Nav from "../components/Nav";
import CorregirEjerciciosSubidosGrid from "../components/CorregirEjerciciosSubidosGrid";
import Footer from "../components/Footer";

/**
 * Página para corregir ejercicios subidos por alumnos (solo profesores)
 * Permite a los profesores revisar y calificar ejercicios
 */
function CorregirEjerciciosSubidos() {
  return (
    <div>
      <Nav />
      <CorregirEjerciciosSubidosGrid />
      <Footer />
    </div>
  );
}

export default CorregirEjerciciosSubidos;
