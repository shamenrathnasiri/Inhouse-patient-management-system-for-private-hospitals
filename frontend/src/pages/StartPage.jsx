import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaHospitalAlt, FaUserMd, FaHeartbeat, FaShieldAlt } from 'react-icons/fa';

const StartPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <FaUserMd className="w-6 h-6" />, title: 'Doctor Portal', desc: 'Manage patients, prescriptions & discharge' },
    { icon: <FaHeartbeat className="w-6 h-6" />, title: 'Nurse Station', desc: 'Track conditions & treatment updates' },
    { icon: <FaShieldAlt className="w-6 h-6" />, title: 'Secure Access', desc: 'Role-based authentication & control' },
  ];

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-dark-950">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-float" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-500/8 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-6 py-12 mx-auto max-w-5xl">
        {/* Hospital Badge */}
        <div className="flex items-center gap-3 px-5 py-2.5 mb-8 rounded-full glass-card-light animate-fade-in-down">
          <FaHospitalAlt className="text-primary-400" />
          <span className="text-sm font-medium tracking-wide text-dark-300">City General Hospital</span>
        </div>

        {/* Hero Title */}
        <h1 className="mb-6 text-5xl font-extrabold leading-tight text-center md:text-6xl lg:text-7xl animate-fade-in-up">
          <span className="text-white">Patient</span>
          <br />
          <span className="text-gradient-primary">Management System</span>
        </h1>

        <p className="max-w-2xl mb-10 text-lg leading-relaxed text-center text-dark-400 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Streamline your hospital operations with our comprehensive inhouse patient management platform. 
          Efficient, secure, and designed for healthcare professionals.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 mb-16 sm:flex-row animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <button
            id="start-login-btn"
            onClick={() => navigate('/login')}
            className="group btn-primary flex items-center justify-center gap-3 px-10 py-4 text-lg"
          >
            Sign In
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <button
            id="start-register-btn"
            onClick={() => navigate('/register')}
            className="btn-secondary flex items-center justify-center gap-3 px-10 py-4 text-lg"
          >
            Create Account
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          {features.map((f, i) => (
            <div key={i} className="group glass-card p-6 text-center transition-all duration-300 hover:border-primary-500/20 hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-colors duration-300">
                {f.icon}
              </div>
              <h3 className="mb-2 text-base font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-dark-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartPage;
