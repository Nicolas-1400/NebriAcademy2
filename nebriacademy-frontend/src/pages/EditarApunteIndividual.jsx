import Nav from "../components/Nav";
import EditarApunteIndividualGrid from "../components/EditarApunteIndividualGrid";
import Footer from "../components/Footer";

/**
 * Página para editar un apunte individual existente
 * Permite modificar apuntes previamente creados
 */
function EditarApunteIndividual() {
  return (
    <div>
      <Nav />
      <EditarApunteIndividualGrid />
      <Footer />
    </div>
  );
}

export default EditarApunteIndividual;
