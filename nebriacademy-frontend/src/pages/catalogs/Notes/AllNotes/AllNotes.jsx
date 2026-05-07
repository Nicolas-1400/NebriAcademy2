import Nav from "../../../../components/layout/Nav/Nav";
import AllNotesGrid from "../../../../components/catalogs/Notes/AllNotesGrid/AllNotesGrid";
import Footer from "../../../../components/layout/Footer/Footer";

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
