import { useParams } from "react-router-dom";
import Nav from "../../components/layout/Nav/Nav.jsx";
import PoliciesGrid from "../../components/support/PoliciesGrid/PoliciesGrid.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";

function Policies() {
  const { tipo } = useParams();
  return (
    <div>
      <Nav />
      <PoliciesGrid tipo={tipo} />
      <Footer />
    </div>
  );
}

export default Policies;
