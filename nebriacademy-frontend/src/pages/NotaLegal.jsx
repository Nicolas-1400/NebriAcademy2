import Nav from "../components/Nav"
import NavProfesor from "../components/NavProfesor"
import Footer from "../components/Footer"
import NotaLegalGrid from "../components/NotaLegalGrid"

function NotaLegal() {
  return (
    <div>
      {localStorage.getItem('tipo') === "profesor" ? <NavProfesor /> : <Nav />}
      <NotaLegalGrid />
      <Footer />
    </div>
  )
}

export default NotaLegal