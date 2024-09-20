import React from 'react'
import { Link } from 'react-router-dom'
import './Css/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2>About Us</h2>
          <p>We provide comprehensive tenant management solutions to streamline property management tasks and improve communication between tenants and landlords.</p>
        </div>

        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h2>Contact Us</h2>
          <p>Email: <a href="mailto:info@tenantmanagement.com">info@tenantmanagement.com</a></p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Tenant Management System. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer