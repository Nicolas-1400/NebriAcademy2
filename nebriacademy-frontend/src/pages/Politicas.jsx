import { useParams } from "react-router-dom";
import Nav from "../components/Nav";
import PoliticasGrid from "../components/PoliticasGrid";
import Footer from "../components/Footer";

function Politicas() {
  const { tipo } = useParams();
  return (
    <div>
      <Nav />
      <PoliticasGrid tipo={tipo} />
      <Footer />
    </div>
  );
}

export default Politicas;
