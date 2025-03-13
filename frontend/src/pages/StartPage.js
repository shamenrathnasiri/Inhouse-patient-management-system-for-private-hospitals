import React from 'react';
import { useNavigate } from 'react-router-dom';
import stimage from '../images/welcome screen.jpg'

const StartPage = () => {
  const navigate = useNavigate(); // Using useNavigate to navigate programmatically

  const handleLoginClick = () => {
    navigate('/login'); // Navigates to the login page
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Navigates to the register page
  };

  return (
    <div >
      <img src={stimage}
      alt="stimage"
      className='flex flex-col items-center justify-center w-full h-full bg-center bg-no-repeat bg-cover brightness-75'/>
    <div className="absolute inset-0 flex items-center justify-center h-screen it ems-center ">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-center">Welcome to Hospital Management System</h2>
        <p className="mb-4 text-center"> </p>
        <div className="space-y-4">
          <button
            onClick={handleLoginClick}
            className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
          <button
            onClick={handleRegisterClick}
            className="w-full py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Register
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StartPage;
