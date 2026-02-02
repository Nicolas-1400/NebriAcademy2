import Nav from "../components/Nav"
import NavProfesor from "../components/NavProfesor"
import Footer from "../components/Footer"

function Apuntes() {
  return (
    <div>
      {localStorage.getItem('tipo') === "profesor" ? <NavProfesor /> : <Nav />}
      Apuntes
      <Footer />
    </div>
  )
}

export default Apuntes