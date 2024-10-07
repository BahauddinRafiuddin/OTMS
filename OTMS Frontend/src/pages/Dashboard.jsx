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
import MyProperties from './MyProperties';
import TenantProfile from './TenantProfile';

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
                            <img src={myProfile} alt="" />
                            <NavLink to="/dashboard/tenant-profile" >
                                My Profile
                            </NavLink>
                        </li>
                        <li>
                            <img src={hometitle} alt="" />
                            <NavLink to="/dashboard/property" >
                                Properties
                            </NavLink>
                        </li>
                        
                    </ul>
                }

            </div>

            {/* Right Content Area with Nested Routes */}
            <div className="dashboard-content">
                <Routes>
                    {userType === "landlord"
                        ? <Route index element={<LandlordProfile />} />
                        : <Route index element={<TenantProfile />} />
                    }

                    {/* Landlord Pages................ */}
                    <Route path="landlord-profile" element={<LandlordProfile />} />
                    <Route path="my-properties" element={<MyProperties />} />
                    {/* <Route path="rent" element={<Rent />} /> */}


                    {/* Tenants Pages..................... */}
                    <Route path="tenant-profile" element={<TenantProfile />} />
                </Routes>
            </div>
        </div>
    )
}

export default Dashboard