import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation
import NurseForm from '../components/NurseForm';
import DoctorForm from '../components/DoctorForm';
import AttendantForm from '../components/AttendantForm';
import PatientDetails from '../components/PatientDetails';

const HomeComponent = () => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();  // Using useNavigate for navigation

  useEffect(() => {
    // Get the role from local storage after the user logs in
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  // Function to format role for the welcome message
  const getWelcomeMessage = () => {
    if (role) {
      return `Welcome, ${role.charAt(0).toUpperCase() + role.slice(1)}!`;
    }
    return "Welcome to the Hospital System";
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('role');  // Clear the stored role
    navigate('/login');  // Redirect to login page using useNavigate
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
        {getWelcomeMessage()}
      </h2>
      
      {/* Logout Button */}
      <div className="text-right mb-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>

      {/* Divide the page into two sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - Patient Information */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Details Section</h3>
          <PatientDetails patientId={2} />
        </div>

        {/* Right Side - Load Form Based on Role */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Section` : "Role Section"}</h3>
          {role === 'nurse' && <NurseForm />}
          {role === 'doctor' && <DoctorForm />}
          {role === 'attendant' && <AttendantForm />}
          {!role && <p className="text-gray-600">No role assigned. Please log in.</p>}
        </div>
      </div>
    </div>
  );
};

export default HomeComponent;
