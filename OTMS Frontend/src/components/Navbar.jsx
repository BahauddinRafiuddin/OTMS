import React, { useContext, useState } from 'react';
import './Css/Navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import dashboard from '../assets/dashboard.svg';

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userType, handleLogout } = useContext(AppContext); // Access context values
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  return (
    <div className="navbar">
      <span onClick={() => navigate('/')}>OTMS .</span>
      <ul>
        <NavLink to="/">
          <li>Home</li>
          <hr />
        </NavLink>

        <NavLink to="/properties">
          <li>Properties</li>
          <hr />
        </NavLink>

        <NavLink to="/about">
          <li>About</li>
          <hr />
        </NavLink>

        <NavLink to="/contact">
          <li>Contact</li>
          <hr />
        </NavLink>
      </ul>

      <div className="nav-btn">
        {isLoggedIn ? (
          <>
            <span>Welcome, {userType === 'landlord' ? 'Landlord' : 'Tenant'}</span>

            <div
              className="dashboard-container"
              onMouseEnter={() => setIsDropdownVisible(true)}
              onMouseLeave={() => setIsDropdownVisible(false)}
            >
              <img src={dashboard} alt="Dashboard Icon" className="dashboard-icon" />

              {isDropdownVisible && (
                <div className="dropdown">
                  <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/register')}>Register</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
