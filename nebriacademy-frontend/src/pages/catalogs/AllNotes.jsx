import Nav from "../../components/layout/Nav/Nav.jsx";
import AllNotesGrid from "../../components/catalogs/Notes/AllNotesGrid/AllNotesGrid.jsx";
import Footer from "../../components/layout/Footer/Footer.jsx";

function AllNotes() {
  return (
    <div>
      <Nav />
      <AllNotesGrid />
      <Footer />
    </div>
  );
}

export default AllNotes;
