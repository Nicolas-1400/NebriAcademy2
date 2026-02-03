import Nav from "../components/Nav"
import Footer from "../components/Footer"
import PerfilGrid from "../components/PerfilGrid"
import PerfilProfesorGrid from "../components/PerfilProfesorGrid"

function Perfil() {
  return (
    <div>
      <Nav />
      {localStorage.getItem('tipo') === "profesor" ? <PerfilProfesorGrid /> : <PerfilGrid />}
      <Footer />
    </div>
  )
}

export default Perfil