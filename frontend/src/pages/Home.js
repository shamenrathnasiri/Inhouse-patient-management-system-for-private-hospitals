import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NurseForm from '../components/NurseForm';
import DoctorForm from '../components/DoctorForm';
import AttendantForm from '../components/AttendantForm';
import PatientDetails from '../components/PatientDetails';

const HomeComponent = () => {
  const [role, setRole] = useState('');
  const [getPatients, setGetPatients] = useState(false);
  const [id, setId] = useState();
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  const getWelcomeMessage = () => {
    if (role) {
      return `Welcome, ${role.charAt(0).toUpperCase() + role.slice(1)}!`;
    }
    return 'Welcome to the Hospital System';
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="max-w-6xl p-6 mx-auto bg-white rounded-lg shadow-lg">
      {/* Header Section: Centered Welcome + Right-Aligned Logout */}
      <div className="flex items-center justify-center mb-6">
        <h2 className="w-full text-3xl font-bold text-center text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text drop-shadow-sm">
          {getWelcomeMessage()}
        </h2>
      </div>

      {/* Logout Button */}
      <div className="mb-4 text-right">
        <button
          onClick={handleLogout}
          className="px-5 py-2 font-medium text-white transition duration-300 ease-in-out bg-red-500 rounded-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Logout
        </button>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left - Patient Details */}
        <div className="p-4 border rounded-lg shadow-inner bg-gradient-to-br from-blue-50 to-white">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">Patient Details Section</h3>
          <PatientDetails getPatients={getPatients} setId={setId}/>
        </div>

        {/* Right - Role Form */}
        <div className="p-4 border rounded-lg shadow-inner bg-gradient-to-br from-green-50 to-white">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Section` : 'Role Section'}
          </h3>
          {role === 'nurse' && <NurseForm getPatients={getPatients} setGetPatients={setGetPatients} id={id}/>}
          {role === 'doctor' && <DoctorForm getPatients={getPatients} setGetPatients={setGetPatients} id={id}/>}
          {role === 'attendant' && <AttendantForm getPatients={getPatients}  setGetPatients={setGetPatients} id={id}/>}
          {!role && <p className="text-gray-600">No role assigned. Please log in.</p>}
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;
