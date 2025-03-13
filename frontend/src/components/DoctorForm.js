import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GeneratePDF from './GeneratePDF';

const DoctorForm = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    diseases: '',
    treatment: '',
    discharge_date: '',
  });

  // Fetch list of patients
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
    try {
      await axios.put(`http://localhost:5000/update/${formData.id}`, {
        diseases: formData.diseases,
        treatment: formData.treatment,
        discharge_date: formData.discharge_date,
      });
      alert('Patient details updated successfully by Doctor');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Doctor Update Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-gray-700">Select Patient ID</label>
          <select
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} (ID: {patient.id})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700">Diseases</label>
          <input
            type="text"
            placeholder="Enter diseases"
            value={formData.diseases}
            onChange={(e) => setFormData({ ...formData, diseases: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700">Treatment</label>
          <input
            type="text"
            placeholder="Enter treatment"
            value={formData.treatment}
            onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700">Discharge Date</label>
          <input
            type="date"
            value={formData.discharge_date}
            onChange={(e) => setFormData({ ...formData, discharge_date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Patient
          </button>
        </div>
      </form>
            <p>Update before proceed to generate pdf</p>
      <div className="mt-10">
      <GeneratePDF patientId={formData.id}/>
        </div>
            
    </div>
  );
};

export default DoctorForm;
