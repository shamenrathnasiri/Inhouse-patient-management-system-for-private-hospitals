import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import loginImg from '../images/loginImg.jpg';
import { useAppContext } from '../context/AppContext';

const LoginComponent = () => {
  const { setCurrentUser } = useAppContext();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // ✅ Set current user from localStorage on mount
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      const { role } = response.data;
      setCurrentUser(role);

      if (role) {
        localStorage.setItem('role', role);
        navigate('/home');
      }
    } catch (error) {
      setErrorMessage('Invalid credentials, please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${loginImg})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md p-8 text-white border shadow-xl bg-white/5 backdrop-blur-md border-white/30 rounded-xl animate-slideUp">
        <h2 className="mb-6 text-3xl font-bold text-center">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="flex items-center px-4 py-2 rounded-md bg-white/20">
            <FaUserAlt className="mr-3" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              required
              className="w-full bg-transparent focus:outline-none placeholder-white/80"
            />
          </div>

          <div className="flex items-center px-4 py-2 rounded-md bg-white/20">
            <FaLock className="mr-3" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
              className="w-full bg-transparent focus:outline-none placeholder-white/80"
            />
          </div>

          {errorMessage && <p className="text-center text-red-400">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full py-2 font-semibold transition-all duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>

          <p className="text-sm text-center text-white/80">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-300 hover:text-blue-400">
              Register
            </Link>
          </p>
        </form>
      </div>

      <style>
        {`
          .animate-slideUp {
            animation: slideUp 1s ease forwards;
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(50px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoginComponent;
