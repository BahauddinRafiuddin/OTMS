import React from 'react'
import '../components/Css/About.css'
const About = () => {
  return (
    <div className="about-us">
      <header className="about-us-header">
        <h1>About Us</h1>
        <p>Welcome to our tenant management system. We are dedicated to making property management easy and efficient.</p>
      </header>

      <section className="our-mission">
        <h2>Our Mission</h2>
        <p>
          Our mission is to provide seamless and efficient property management solutions that enhance the experience of both tenants and property managers. We strive to simplify communication, streamline processes, and offer valuable tools that save time and reduce hassle.
        </p>
      </section>

      <section className="our-vision">
        <h2>Our Vision</h2>
        <p>
          We envision a world where property management is effortless and transparent, where technology enables better relationships between tenants and landlords, and where our solutions drive positive change in the property management industry.
        </p>
      </section>

      {/* <section className="our-team">
        <h2>Meet Our Team</h2>
        <div className="team-member">
          <img src="https://via.placeholder.com/150" alt="Team Member" />
          <h3>Jane Doe</h3>
          <p>Co-Founder & CEO</p>
          <p>Jane is passionate about creating innovative solutions that address real-world problems. With over a decade of experience in property management, she leads our team with vision and dedication.</p>
        </div>

        <div className="team-member">
          <img src="https://via.placeholder.com/150" alt="Team Member" />
          <h3>John Smith</h3>
          <p>Co-Founder & CTO</p>
          <p>John brings extensive technical expertise and a love for problem-solving. He oversees the development of our platform, ensuring it meets the highest standards of performance and reliability.</p>
        </div>

      </section> */}

      <section className="our-values">
        <h2>Our Values</h2>
        <ul>
          <li>Integrity: We act with honesty and transparency in everything we do.</li>
          <li>Innovation: We continuously seek new and better ways to serve our users.</li>
          <li>Customer Focus: We are committed to meeting the needs of our users and exceeding their expectations.</li>
          <li>Collaboration: We work together as a team to achieve our goals and support each other.</li>
        </ul>
      </section>
    </div>
  )
}

export default About