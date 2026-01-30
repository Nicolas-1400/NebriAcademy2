import Nav from "../components/Nav"
import NavProfesor from "../components/NavProfesor"
import Footer from "../components/Footer"
import PoliticaDeCookiesGrid from "../components/PoliticaDeCookiesGrid"

function PoliticaDeCookies() {
  return (
    <div>
      {localStorage.getItem('tipo') === "profesor" ? <NavProfesor /> : <Nav />}
      <PoliticaDeCookiesGrid />
      <Footer />
    </div>
  )
}

export default PoliticaDeCookies