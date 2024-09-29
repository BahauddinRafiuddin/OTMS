import React from 'react'
import { Link, Route, Routes } from 'react-router-dom';
import About from './About';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Left Sidebar */}
            <div className="dashboard-sidebar">
                <ul>
                    <li>
                        <Link to="/dashboard/about" activeclassname="active">
                            Profile
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/property" activeclassname="active">
                            Property
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard/rent" activeclassname="active">
                            Rent
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Right Content Area with Nested Routes */}
            <div className="dashboard-content">
                <Routes>
                <Route index element={<About />} /> {/* Default profile page */}
                    <Route path="about" element={<About />} />
                    {/* <Route path="property" element={<Property />} />
                    <Route path="rent" element={<Rent />} /> */}
                </Routes>
            </div>
        </div>
    )
}

export default Dashboard