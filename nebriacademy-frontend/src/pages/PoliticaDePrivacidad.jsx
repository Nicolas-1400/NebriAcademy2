import Nav from "../components/Nav"
import NavProfesor from "../components/NavProfesor"
import PoliticaDePrivacidadGrid from "../components/PoliticaDePrivacidadGrid"
import Footer from "../components/Footer"

function PoliticaDePrivacidad() {
  return (
    <div>
      {localStorage.getItem('tipo') === "profesor" ? <NavProfesor /> : <Nav />}
      <PoliticaDePrivacidadGrid />
      <Footer />
    </div>
  )
}

export default PoliticaDePrivacidad