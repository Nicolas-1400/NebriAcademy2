import { useParams } from "react-router-dom";
import Nav from "../../../components/layout/Nav/Nav";
import AddContentGrid from "../../../components/management/CourseManagement/AddContentGrid";
import Footer from "../../../components/layout/Footer/Footer";

function AddContent() {
  const { tipo, id } = useParams();

  return (
    <div>
      <Nav />
      <AddContentGrid tipo={tipo} idCurso={id} />
      <Footer />
    </div>
  );
}

export default AddContent;
