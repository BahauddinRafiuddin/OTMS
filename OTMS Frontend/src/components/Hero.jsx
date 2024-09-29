import React from 'react'
import './Css/Hero.css'
import image1 from '../assets/property2.jpg'
import right from '../assets/right.svg';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate=useNavigate()
    return (
        <div className='hero'>
            <div className='hero-text'>
                <h1>Welcome To <span>OTMS</span></h1>
                <p>Your Ultimate Solution for Effortless Property Management </p>
                <button onClick={()=>{navigate('/properties'),scrollTo(0,0)}}>Explore Now <img src={right} alt="" /></button>
            </div>
            <div className='hero-img'>
                <img src={image1} alt="" />
                <hr />
            </div>
        </div>
    )
}

export default Hero