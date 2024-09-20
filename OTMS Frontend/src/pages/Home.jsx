import React from 'react'
import Hero from '../components/Hero'
import '../components/Css/Home.css'
import HomeCard from '../components/HomeCard'
const Home = () => {
  return (
    <div className='home'>
      <Hero/>
      <HomeCard/>
    </div>
  )
}

export default Home