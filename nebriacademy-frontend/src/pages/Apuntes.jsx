import Nav from "../components/Nav";
import ApuntesGrid from "../components/ApuntesGrid";
import Footer from "../components/Footer";

/**
 * Página de apuntes
 * Muestra todos los apuntes disponibles en la plataforma
 */
function Apuntes() {
  return (
    <div>
      <Nav />
      <ApuntesGrid />
      <Footer />
    </div>
  );
}

export default Apuntes;
