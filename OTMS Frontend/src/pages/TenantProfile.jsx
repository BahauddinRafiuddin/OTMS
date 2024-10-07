import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext';
import '../components/Css/TenantProfile.css';
import cross from '../assets/cross.svg'

const TenantProfile = () => {
    const { userId } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [tenant, setTenant] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const [isEditMode, setIsEditMode] = useState(false); // New state to handle edit mode
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        avatar: null // to handle avatar upload
    });



    useEffect(() => {
        const getTenantById = async () => {
            if (!userId || !token) {
                setError("User is not logged in.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:4000/api/tenant/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch Tenant details!');
                }

                const { tenant } = await response.json();
                setTenant(tenant);
                setFormData({
                    firstName: tenant.firstName,
                    lastName: tenant.lastName,
                    email: tenant.email,
                    phoneNumber: tenant.phoneNumber,
                    dateOfBirth: new Date(tenant.dateOfBirth).toISOString().split('T')[0],
                    gender: tenant.gender,
                    avatar: null // initial avatar state
                });
            } catch (error) {
                console.log(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getTenantById();
    }, [userId, token]);

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode); // Toggle edit mode
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleAvatarChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            avatar: e.target.files[0] // store the selected file
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('firstName', formData.firstName);
        formDataToSend.append('lastName', formData.lastName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phoneNumber', formData.phoneNumber);
        formDataToSend.append('dateOfBirth', formData.dateOfBirth);
        formDataToSend.append('gender', formData.gender);

        if (formData.avatar) {
            formDataToSend.append('avatar', formData.avatar); // append the avatar if selected
        }

        try {
            const response = await fetch(`http://localhost:4000/api/tenant/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formDataToSend // sending as form-data for handling file upload
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Failed to update Tenant profile.');
            }

            setTenant(result.tenant); // Update landlord state with new data
            setIsEditMode(false); // Exit edit mode
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='tenant-profile-page'>
            <h2>Tenant Profile</h2>
            {(tenant && !isEditMode) && (
                <div className='tenant-profile-details'>
                    <img src={tenant.avatar} alt={`${tenant.firstName} ${tenant.lastName}`} className='profile-avatar' />
                    <p className='tenant-details'><strong>First Name:</strong> {tenant.firstName}</p>
                    <p className='tenant-details'><strong>Last Name:</strong> {tenant.lastName}</p>
                    <p className='tenant-details'><strong>Email:</strong> {tenant.email}</p>
                    <p className='tenant-details'><strong>Phone Number:</strong> {tenant.phoneNumber}</p>
                    <p className='tenant-details'><strong>Date of Birth:</strong> {new Date(tenant.dateOfBirth).toLocaleDateString()}</p>
                    <p className='tenant-details'><strong>Gender:</strong> {tenant.gender}</p>
                    {/* <p className='tenant-details'><strong>PAN Card Number:</strong> {tenant.panCardNumber}</p> */}

                    <button className="tenant-edit-profile-btn" onClick={toggleEditMode}>
                        Edit Profile
                    </button>
                </div>
            )}

            {isEditMode && (
                <div className='edit-profile-page'>
                    <h3>Edit Profile</h3>
                    <img src={cross} className='cross-img' onClick={toggleEditMode} />
                    <form onSubmit={handleSubmit} className='edit-profile-form'>
                        <label>
                            First Name:
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Last Name:
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Phone Number:
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Date of Birth:
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label>
                            Gender:
                            <select name="gender" value={formData.gender} onChange={handleInputChange}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </label>
                        <label>
                            Avatar:
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </label>
                        <button type="submit">Save Changes</button>

                    </form>
                </div>
            )}
        </div>
    )
}

export default TenantProfile