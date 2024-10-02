import React, { useState, useRef } from 'react';
import '../components/Css/Register.css';
import moment from 'moment';
import avatar from '../assets/avatar.png'
import avatarSVG from '../assets/avatarSVG.svg'
import email from '../assets/email.svg'
import call from '../assets/call.svg'
import password from '../assets/password.svg'
import { Navigate, useNavigate } from 'react-router-dom';

const Register = () => {
    const [isLandlord, setIsLandlord] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        gender: 'Male',
        dateOfBirth: '',
        avatar: null,
        panCardNumber: '', // For landlords only
    });
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null); // State for image preview
    const fileInputRef = useRef(null); // Ref for file input
    const [loading, setLoading] = useState(false); // New loading state
    const navigate = useNavigate()

    // Handle Change...
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle File Change...
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, avatar: file });
        // Generate a URL for the image preview
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };

    // Validating Email....
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validating Pancard...
    const validatePAN = (pan) => {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(pan);
    };

    // Validate if user is at least 18 years old
    const validateAge = (dob) => {
        const birthDate = moment(dob);
        const age = moment().diff(birthDate, 'years');
        return age >= 18;
    };

    // Handle Form Submission ...
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password, panCardNumber, dateOfBirth } = formData;
        const newErrors = {};

        // Validate Email
        if (!validateEmail(email)) {
            newErrors.email = 'Invalid email format.';
        }

        // Validate Password
        if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
        }

        // Validate PAN Card Number (only for landlords)
        if (isLandlord && !validatePAN(panCardNumber)) {
            newErrors.panCardNumber = 'Invalid PAN card number format.';
        }

        // Validate Date of Birth and Age
        if (!validateAge(dateOfBirth)) {
            newErrors.dateOfBirth = 'You must be at least 18 years old.';
        }

        if (!formData.avatar) {
            newErrors.avatar = 'Profile Picture Is Required.';
        }

        // Set errors if any
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Stop submission if there are errors
        }

        // Setting Data In Key-Value Manner for file upload...
        const formDataToSubmit = new FormData();
        for (const key in formData) {
            formDataToSubmit.append(key, formData[key]);
        }

        // Setting URL based on user type...
        const url = isLandlord
            ? 'http://localhost:4000/api/landlord/register'
            : 'http://localhost:4000/api/tenant/register';

        setLoading(true); // Set loading state to true
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formDataToSubmit,
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'An error occurred!');
            }
            alert(data.message); // Display success message
            navigate('/login')
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // Function to trigger the file input click
    const handleAvatarClick = () => {
        fileInputRef.current.click(); // Programmatically trigger file input
    };
    return (
        <div className="register-page">
            <h1>{isLandlord ? 'Landlord Registration' : 'Tenant Registration'}</h1>
            <div className='register-btn'>
                <button onClick={() => setIsLandlord(true)}>Register As Landlord</button>
                <button onClick={() => setIsLandlord(false)}>Register As Tenant</button>
            </div>

            <form onSubmit={handleSubmit} className='register-form'>

                {/* Hidden file input */}
                <input
                    type="file"
                    name="avatar"
                    ref={fileInputRef} // Connect ref to input
                    onChange={handleFileChange}
                    style={{ display: 'none' }} // Hide the file input
                // required
                />

                {/* Avatar display (with image preview or default icon) */}
                <div className="avatar-upload" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
                    <span>Add Profile Picture</span>
                    {imagePreview ? (
                        <img
                            src={imagePreview}
                            alt="Avatar Preview"
                            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                        />
                    ) : (
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* <span role="img" aria-label="Upload Icon">📷</span> Replace this with an icon if necessary */}
                            <img
                                src={avatar}
                                alt="Avatar Preview"
                                style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                            />
                        </div>
                    )}
                </div>
                {errors.avatar && <span className="error">{errors.avatar}</span>}

                <div className='register-form-input'>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Enter Your First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <img src={avatarSVG} alt="" />
                </div>

                <div className='register-form-input'>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Enter Your Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    <img src={avatarSVG} alt="" />
                </div>

                <div className='register-form-input'>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <img src={email} alt="" />

                </div>
                {errors.email && <span className="error">{errors.email}</span>}

                <div className='register-form-input'>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <img src={password} alt="" />

                </div>
                {errors.password && <span className="error">{errors.password}</span>}

                <div className='register-form-input'>
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                    <img src={call} alt="" />
                </div>

                <div className='register-form-input '>
                    <select name="gender" value={formData.gender} onChange={handleChange} className='select'>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className='register-form-input'>
                    <input
                        type="date"
                        name="dateOfBirth"
                        placeholder="Date of Birth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                </div>
                {errors.dateOfBirth && <span className="error">{errors.dateOfBirth}</span>}


                {isLandlord && (
                    <div className='register-form-input'>
                        {isLandlord && (
                            <input
                                type="text"
                                name="panCardNumber"
                                placeholder="PAN Card Number"
                                value={formData.panCardNumber}
                                onChange={handleChange}
                                required
                            />
                        )}

                    </div>

                )}
                {errors.panCardNumber && <span className="error">{errors.panCardNumber}</span>}
                <button type="submit">Register</button>
            </form>
            <div className='navigate-login'>
                <p>Already Have An Account ? <span onClick={() => navigate('/login')}>Click Here To Login</span> </p>
            </div>
        </div>
    );
};

export default Register;
