import Nav from "../components/Nav";
import AddApunteIndividualGrid from "../components/AddApunteIndividualGrid";
import Footer from "../components/Footer";

/**
 * Página para añadir un apunte individual
 * Permite a usuarios crear y subir nuevos apuntes
 */
function AddApunteIndividual() {
  return (
    <div>
      <Nav />
      <AddApunteIndividualGrid />
      <Footer />
    </div>
  );
}

export default AddApunteIndividual;
