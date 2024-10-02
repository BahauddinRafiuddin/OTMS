import React, { useContext } from 'react'
import { Link, Route, Routes } from 'react-router-dom';
import About from './About';
import { AppContext } from '../context/AppContext';
import LandlordProfile from './LandlordProfile';
import '../components/Css/Dashboard.css'
import myProfile from '../assets/myProfile.svg'
import hometitle from '../assets/property.svg'
import avatarSVG from '../assets/avatarWhite.svg'
import { NavLink } from 'react-router-dom';

const Dashboard = () => {
    const { userType, userId } = useContext(AppContext)
    // console.log("UserId",userId)
    return (
        <div className="dashboard-page">
            {/* Left Sidebar */}
            <div className="dashboard-sidebar">
                <h3>Dashboard</h3>
                {userType === 'landlord'
                    ?
                    <ul>
                        <li >
                            <img src={myProfile} alt="" />
                            <NavLink to="/dashboard/landlord-profile" >
                                My Profile
                            </NavLink>
                        </li>
                        <li>
                            <img src={hometitle} alt="" />
                            <NavLink to="/dashboard/my-properties" >
                                My Properties                              
                            </NavLink>
                        </li>
                        <li>
                            <img src={avatarSVG} alt="" />
                            <NavLink to="/dashboard/tenant-details" >
                                Tenant Details                         
                            </NavLink>
                        </li>
                    </ul>
                    :
                    <ul>
                        <li>
                            <NavLink to="/dashboard/about" >
                                Profile
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/property" >
                                Property
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/rent" >
                                Rent
                            </NavLink>
                        </li>
                    </ul>
                }

            </div>

            {/* Right Content Area with Nested Routes */}
            <div className="dashboard-content">
                <Routes>
                    <Route index element={<About />} /> {/* Default profile page */}

                    <Route path="landlord-profile" element={<LandlordProfile />} />
                    {/* <Route path="property" element={<Property />} />
                    <Route path="rent" element={<Rent />} /> */}
                </Routes>
            </div>
        </div>
    )
}

export default Dashboard