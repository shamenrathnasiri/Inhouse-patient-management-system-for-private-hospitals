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

  const handleDelete = async () => {
    if (!formData.id) {
      alert("Please select a patient to delete.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this patient?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/delete/${formData.id}`);
        alert('Patient deleted successfully');
        setFormData({ id: '', diseases: '', treatment: '', discharge_date: '' }); // Reset form
        // Optionally, remove the deleted patient from the list immediately
        setPatients(patients.filter(patient => patient.id !== formData.id));
      } catch (error) {
        console.error(error);
        alert('Error deleting patient');
      }
    }
  };

  return (
    <div className="max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-center text-gray-800">Doctor Update Form</h2>
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
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Patient
          </button>
        </div>
      </form>

      <div className="mt-4">
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Delete Patient
        </button>
      </div>

      <p>Update before proceeding to generate PDF</p>
      <div className="mt-10">
        <GeneratePDF patientId={formData.id} />
      </div>
    </div>
  );
};

export default DoctorForm;
