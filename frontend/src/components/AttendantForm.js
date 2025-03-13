import React, { useState } from 'react';
import axios from 'axios';

const AttendantForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dob: '',
    admit_date: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await axios.post('http://localhost:5000/register', formData);
      setSuccessMessage('Patient registered successfully!');
      setFormData({ name: '', age: '', dob: '', admit_date: '' }); // Reset form
    } catch (error) {
      setErrorMessage('Failed to register patient. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Register Patient</h2>

      {/* Success and Error Messages */}
      {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            placeholder="Enter patient name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-700">Age</label>
          <input
            type="number"
            placeholder="Enter age"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-700">Date of Birth</label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-gray-700">Admit Date</label>
          <input
            type="date"
            value={formData.admit_date}
            onChange={(e) => setFormData({ ...formData, admit_date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register Patient
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendantForm;
