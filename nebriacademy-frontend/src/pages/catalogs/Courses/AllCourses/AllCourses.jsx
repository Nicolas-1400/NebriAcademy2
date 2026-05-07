import Footer from "../../../../components/layout/Footer/Footer";
import Nav from "../../../../components/layout/Nav/Nav";
import AllCoursesGrid from "../../../../components/catalogs/Courses/AllCoursesGrid/AllCoursesGrid";

function AllCourses() {
  return (
    <div>
      <Nav />
      <AllCoursesGrid />
      <Footer />
    </div>
  );
}

export default AllCourses;
