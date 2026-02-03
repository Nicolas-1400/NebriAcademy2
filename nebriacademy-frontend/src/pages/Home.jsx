import Nav from '../components/Nav'
import Footer from '../components/Footer'
import HomeFeed from '../components/HomeFeed'
import HomeProfesorGrid from '../components/HomeProfesorGrid'

function Home() {
  return (
    <div>
      <Nav />
      {localStorage.getItem('tipo') === "profesor" ? <HomeProfesorGrid /> : <HomeFeed />}
      <Footer />
    </div>
  )
}

export default Home