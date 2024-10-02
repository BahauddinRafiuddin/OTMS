import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import '../components/Css/LandlordProfilePage.css';

const LandlordProfile = () => {
    const { userId } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [landlord, setLandlord] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const getLandlordById = async () => {
            if (!userId || !token) {
                setError("User is not logged in.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:4000/api/landlord/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch landlord details!');
                }

                const { landlord } = await response.json();
                setLandlord(landlord);
            } catch (error) {
                console.log(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getLandlordById();
    }, [userId, token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='landlord-profile-page'>
            <h2>Landlord Profile</h2>
            {landlord && (
                <div className='profile-details'>
                    <img src={landlord.avatar} alt={`${landlord.firstName} ${landlord.lastName}`} className='profile-avatar' />
                    <p className='landlord-details'><strong>First Name:</strong> {landlord.firstName}</p>
                    <p className='landlord-details'><strong>Last Name:</strong> {landlord.lastName}</p>
                    <p className='landlord-details'><strong>Email:</strong> {landlord.email}</p>
                    <p className='landlord-details'><strong>Phone Number:</strong> {landlord.phoneNumber}</p>
                    <p className='landlord-details'><strong>Date of Birth:</strong> {new Date(landlord.dateOfBirth).toLocaleDateString()}</p>
                    <p className='landlord-details'><strong>Gender:</strong> {landlord.gender}</p>
                    <p className='landlord-details'><strong>PAN Card Number:</strong> {landlord.panCardNumber}</p>
                </div>
            )}
        </div>
    );
};

export default LandlordProfile;
