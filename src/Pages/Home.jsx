import React from 'react'
import Footer from '../components/Footer/Footer'
import HeroSection from '../components/Home/HeroSection.jsx'
import TryOn from '../components/Home/TryOn.jsx'
import HowWorks from '../components/Home/HowWorks.jsx'

const Home = () => {
  return (
    <div>
      <HeroSection />
      <TryOn />
      <HowWorks />
      <Footer />
    </div>
  )
}

export default Home