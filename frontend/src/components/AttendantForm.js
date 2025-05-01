import React, { useState } from 'react';
import axios from 'axios';

const AttendantForm = ({setGetPatients}) => {
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
      setSuccessMessage('✅ Patient registered successfully!');
      setFormData({ name: '', age: '', dob: '', admit_date: '' });
      setGetPatients(true);
      
    } catch (error) {
      setErrorMessage('❌ Failed to register patient. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8 transition-transform duration-500 transform hover:scale-[1.01]">
        <h2 className="mb-6 text-3xl font-bold text-center text-purple-700">Patient Registration</h2>

        {successMessage && <p className="mb-2 text-center text-green-600">{successMessage}</p>}
        {errorMessage && <p className="mb-2 text-center text-red-600">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              placeholder="e.g., 45"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Admit Date</label>
            <input
              type="date"
              value={formData.admit_date}
              onChange={(e) => setFormData({ ...formData, admit_date: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white transition duration-300 rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Register Patient
          </button>
        </form>
      </div>
    </div>
  );
};

export default AttendantForm;
