import { useParams } from "react-router-dom";
import Nav from "../../components/layout/Nav/Nav";
import PoliciesGrid from "../../components/support/PoliciesGrid";
import Footer from "../../components/layout/Footer/Footer";

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
