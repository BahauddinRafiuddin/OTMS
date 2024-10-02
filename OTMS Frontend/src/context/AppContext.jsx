import React, { createContext, useState, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom'
// Create the context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState('');
    const [userId, setUserId] = useState('')

    // Check if user is already logged in when the app loads
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (token) {
            setIsLoggedIn(true);
            setUserType(userType);
        }
    }, []);

    // Handle logout functionality
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        setIsLoggedIn(false);
        setUserType('');
        navigate('/login')
    };

    return (
        <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, userType, handleLogout, setUserType, userId, setUserId }}>
            {children}
        </AppContext.Provider>
    );
};
