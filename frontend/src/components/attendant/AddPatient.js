import React, { useState } from 'react';
import axios from 'axios';

const AddPatient = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dob: '',
    admit_date: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      setMessage(response.data.message);

      // Clear input fields
      setFormData({
        name: '',
        age: '',
        dob: '',
        admit_date: '',
      });

      // Hide success message after 3 seconds
      setTimeout(() => setMessage(''), 2500);

    } catch (error) {
      setError('Error registering patient. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="register-patient-container">
      <h2 className="mb-4 text-xl font-bold">Register a New Patient</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold" htmlFor="name">Patient Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold" htmlFor="age">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold" htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold" htmlFor="admit_date">Admission Date</label>
          <input
            type="date"
            name="admit_date"
            value={formData.admit_date}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          Register Patient
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default AddPatient;
