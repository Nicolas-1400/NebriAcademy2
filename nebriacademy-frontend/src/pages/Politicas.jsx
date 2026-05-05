import { useParams } from "react-router-dom";
import Nav from "../components/layout/Nav/Nav";
import PoliticasGrid from "../components/PoliticasGrid";
import Footer from "../components/layout/Footer/Footer";

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
