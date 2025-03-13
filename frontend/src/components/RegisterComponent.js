import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RegisterComponent = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'attendant', // Default role
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate(); // Initialize navigate

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset success and error messages
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Step 1: Check if the username already exists
      const checkResponse = await axios.post('http://localhost:5000/check-user', { username: formData.username });

      if (checkResponse.data.exists) {
        // If username exists, show error message
        setErrorMessage('Username is already taken. Please choose another one.');
        return;
      }

      // Step 2: If username is available, proceed with registration
      const response = await axios.post('http://localhost:5000/register-user', formData);

      // If registration is successful, show success message
      setSuccessMessage('Registration successful! You can now log in.');

      // Redirect to the login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Delay the redirect to allow user to see the success message

    } catch (error) {
      setErrorMessage('Error registering user. Please try again.');
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Register</h2>

        {/* Username Input */}
        <div className="flex flex-col">
          <label htmlFor="username" className="text-sm text-gray-600">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            required
            className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
            className="mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Role Selection */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-600">Select Role</label>
          <div className="flex items-center">
            <input
              type="radio"
              id="attendant"
              name="role"
              value="attendant"
              checked={formData.role === 'attendant'}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="attendant" className="text-sm text-gray-700">Attendant</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="nurse"
              name="role"
              value="nurse"
              checked={formData.role === 'nurse'}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="nurse" className="text-sm text-gray-700">Nurse</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="doctor"
              name="role"
              value="doctor"
              checked={formData.role === 'doctor'}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="doctor" className="text-sm text-gray-700">Doctor</label>
          </div>
        </div>

        {/* Error and Success Messages */}
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterComponent;
