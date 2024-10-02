import React, { createContext, useState, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom'
// Create the context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState('');
    const [userId, setUserId] = useState(()=> localStorage.getItem('userId'))


    // Check if user is already logged in when the app loads
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');
        const storedUserId = localStorage.getItem('userId');
        if (token) {
            setIsLoggedIn(true);
            setUserType(userType);
            setUserId(storedUserId); // Set user ID in state
        }
    }, []);

    // Handle logout functionality
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId'); // Clear user ID on logout
        setIsLoggedIn(false);
        setUserType('');
        setUserId(null); // Reset userId state
        navigate('/login')
    };

    return (
        <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, userType, handleLogout, setUserType, userId, setUserId }}>
            {children}
        </AppContext.Provider>
    );
};
