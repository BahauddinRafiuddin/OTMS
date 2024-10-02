import React, { useState, useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import '../components/Css/Login.css';
import email from '../assets/email.svg'
import openEye from '../assets/openEye.svg'
import closeEye from '../assets/closeEye.svg'
import { AppContext } from '../context/AppContext';

const Login = () => {
  const navigate = useNavigate()
  const { setIsLoggedIn, setUserType, setUserId } = useContext(AppContext); // Access context values
  const [isLandlord, setIsLandlord] = useState(true)
  const [showPass, setShowPass] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  // Update formData dynamically based on field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Setting URL based on user type...
    const url = isLandlord
      ? 'http://localhost:4000/api/landlord/login'
      : 'http://localhost:4000/api/tenant/login';

    try {
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token); // Store token for session management
        localStorage.setItem("userType", isLandlord ? "landlord" : "tenant");
        console.log(data)
        setIsLoggedIn(true);
        // Store only the user id in local state
        const userId = isLandlord ? data.landlord._id : data.tenant._id;
        setUserId(userId)
        setUserType(isLandlord ? 'landlord' : 'tenant');
        alert(data.message)
        navigate('/')
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Catch Error:', err); // Log the error for debugging
      setError("Login failed! Please check your credentials.");
    }
  };



  return (
    <div className='login-page'>

      <div className="login-btn">
        <button onClick={() => setIsLandlord(true)}>Login As Landlord</button>
        <button onClick={() => setIsLandlord(false)}>Login As Tenant</button>
      </div>

      <form onSubmit={handleSubmit} className='login-form'>
        <h1>{isLandlord ? "Landlord Login" : "Tenant Login"}</h1>
        <div className="login-form-input">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='Enter Your Email'
            required
          />
          <img src={email} alt="" />
        </div>

        <div className="login-form-input">
          <input
            type={showPass ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder='Enter Your Password'
            required
          />
          <img src={showPass ? openEye : closeEye} alt="" onClick={() => setShowPass(!showPass)} />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">{isLandlord ? "Login as Landlord" : "Login as Tenant"}</button>
      </form>
      <div className='navigate-register'>
        <p>Don't Have An Account ? <span onClick={() => navigate('/register')}>Click Here Create Account</span> </p>
      </div>
    </div>
  )
}

export default Login