import React from 'react'
import './Css/Navbar.css'
import { NavLink, useNavigate } from 'react-router-dom'
const Navbar = () => {

  const navigate=useNavigate()

  return (
    <div className='navbar'>
      <span onClick={()=>navigate('/')}>OTMS .</span>
      <ul>
        <NavLink to='/'>
          <li>Home</li>
          <hr />
        </NavLink>

        <NavLink to='/properties'>
          <li>Properties</li>
          <hr />
        </NavLink>

        <NavLink to='/about'>
          <li>About</li>
          <hr />
        </NavLink>

        <NavLink to='/contact'>
          <li>Contact</li>
          <hr />
        </NavLink>
      </ul>

      <div className='nav-btn'>
        <button>Login</button>
        <button>Register</button>
      </div>
    </div>
  )
}

export default Navbar