import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PoliticaDeCookiesGrid from "../components/PoliticaDeCookiesGrid";

/**
 * Página de Política de Cookies
 * Muestra información sobre el uso de cookies en la plataforma
 */
function PoliticaDeCookies() {
  return (
    <div>
      <Nav />
      <PoliticaDeCookiesGrid />
      <Footer />
    </div>
  );
}

export default PoliticaDeCookies;
