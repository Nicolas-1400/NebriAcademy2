import Nav from '../components/Nav'
import NavProfesor from '../components/NavProfesor'
import Footer from '../components/Footer'
import HomeFeed from '../components/HomeFeed'
import HomeProfesorGrid from '../components/HomeProfesorGrid'

function Home() {
  return (
    <div>
      {localStorage.getItem('tipo') === "profesor" ? <NavProfesor /> : <Nav />}
      {localStorage.getItem('tipo') === "profesor" ? <HomeProfesorGrid /> : <HomeFeed />}
      <Footer />
    </div>
  )
}

export default Home