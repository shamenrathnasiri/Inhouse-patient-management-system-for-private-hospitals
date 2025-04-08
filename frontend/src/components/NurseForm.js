import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NurseForm = () => {
  const [formData, setFormData] = useState({
    id: '',
    symptoms: '',
    condition: '',
  });

  const [patients, setPatients] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch patient list on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patients');
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await axios.put(`http://localhost:5000/update/${formData.id}`, {
        symptoms: formData.symptoms,
        condition: formData.condition,
      });

      setSuccessMessage('Patient details updated successfully by Nurse');
      setFormData({ id: '', symptoms: '', condition: '' }); // Reset form
    } catch (error) {
      setErrorMessage('Failed to update patient details.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-center text-gray-700">Head of Nurse Update Form</h2>

      {/* Success & Error Messages */}
      {successMessage && <p className="text-center text-green-500">{successMessage}</p>}
      {errorMessage && <p className="text-center text-red-500">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select Patient ID */}
        <div className="space-y-2">
          <label className="block text-gray-700">Select Patient</label>
          <select
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} (ID: {patient.id})
              </option>
            ))}
          </select>
        </div>

        {/* Symptoms Input */}
        <div className="space-y-2">
          <label className="block text-gray-700">Symptoms</label>
          <input
            type="text"
            placeholder="Enter symptoms"
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Condition Input */}
        <div className="space-y-2">
          <label className="block text-gray-700">Condition</label>
          <input
            type="text"
            placeholder="Enter condition"
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Patient
          </button>
        </div>
      </form>
    </div>
  );
};

export default NurseForm;