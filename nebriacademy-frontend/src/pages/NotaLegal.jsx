import Nav from "../components/Nav";
import Footer from "../components/Footer";
import NotaLegalGrid from "../components/NotaLegalGrid";

/**
 * Página de Nota Legal
 * Muestra información legal sobre el uso de la plataforma
 */
function NotaLegal() {
  return (
    <div>
      <Nav />
      <NotaLegalGrid />
      <Footer />
    </div>
  );
}

export default NotaLegal;
