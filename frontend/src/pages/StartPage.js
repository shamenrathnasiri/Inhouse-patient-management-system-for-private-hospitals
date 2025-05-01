import React from 'react';
import { useNavigate } from 'react-router-dom';
import stimage from '../images/welcome screen.jpg';

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background image */}
      <img
        src={stimage}
        alt="Hospital Background"
        className="absolute top-0 left-0 object-cover w-full h-full brightness-50"
      />

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl drop-shadow-lg animate-fadeInUp">
          Welcome to <br /> In house Patients Management System
        </h1>
        <p className="mb-8 text-lg delay-100 md:text-xl drop-shadow animate-fadeInUp">
          Streamline your clinic operations with ease and efficiency.
        </p>

        {/* Buttons */}
        <div className="w-full max-w-xs space-y-4 delay-200 animate-fadeInUp">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 transition-all duration-300 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="w-full py-3 transition-all duration-300 bg-green-600 rounded-lg shadow-lg hover:bg-green-700"
          >
            Register
          </button>
        </div>
      </div>

      {/* Animations (optional - Tailwind plugin or custom CSS) */}
      <style>
        {`
          .animate-fadeInUp {
            animation: fadeInUp 1s ease both;
          }

          .delay-100 {
            animation-delay: 0.3s;
          }

          .delay-200 {
            animation-delay: 0.6s;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
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

export default StartPage;
