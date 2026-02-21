import Nav from "../components/Nav";
import Footer from "../components/Footer";
import HomeFeed from "../components/HomeFeed";
import HomeProfesorGrid from "../components/HomeProfesorGrid";
import useAuthStore from "../store/useAuthStore";

function Home() {
  return (
    <div>
      <Nav />
      {useAuthStore((state) => state.tipo) === "profesor" ? (
        <HomeProfesorGrid />
      ) : (
        <HomeFeed />
      )}
      <Footer />
    </div>
  );
}

export default Home;
