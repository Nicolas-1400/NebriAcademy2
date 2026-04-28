import { useParams } from "react-router-dom";
import Nav from "../components/Nav";
import AddContentGrid from "../components/AddContentGrid";
import Footer from "../components/Footer";

function AddContenido() {
  const { tipo, id } = useParams();

  return (
    <div>
      <Nav />
      <AddContentGrid tipo={tipo} idCurso={id} />
      <Footer />
    </div>
  );
}

export default AddContenido;
