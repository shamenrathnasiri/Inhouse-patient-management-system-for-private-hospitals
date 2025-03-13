import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientDetails = () => {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState('');

  // Fetch all patients to display in the select dropdown
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patients');
        setPatients(response.data);
      } catch (err) {
        setError('Error fetching patients');
      }
    };
    fetchPatients();
  }, []);

  // Handle fetching details when patient is selected
  const handleFetchDetails = async () => {
    if (!patientId) {
      setError('Please select a patient ID');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/patients/${patientId}`);
      setPatientDetails(response.data);
      setError('');
    } catch (err) {
      setError('Error fetching patient details');
      setPatientDetails(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4"></h2>

      {/* Patient Select Dropdown */}
      <div className="space-y-2 mb-4">
        <label className="block text-gray-700">Select Patient ID</label>
        <select
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name} (ID: {patient.id})
            </option>
          ))}
        </select>

        <button
          onClick={handleFetchDetails}
          className="w-full py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Fetch Patient Details
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Display Patient Details */}
      {patientDetails && (
        <div className="space-y-4 mt-6">
          <div>
            <strong>Name:</strong> <span>{patientDetails.name}</span>
          </div>
          <div>
            <strong>Age:</strong> <span>{patientDetails.age}</span>
          </div>
          <div>
            <strong>Date of Birth:</strong> <span>{patientDetails.dob}</span>
          </div>
          <div>
            <strong>Admit Date:</strong> <span>{patientDetails.admit_date}</span>
          </div>
          <div>
            <strong>Symptoms:</strong> <span>{patientDetails.symptoms || 'Not provided'}</span>
          </div>
          <div>
            <strong>Condition:</strong> <span>{patientDetails.condition || 'Not provided'}</span>
          </div>
          <div>
            <strong>Diseases:</strong> <span>{patientDetails.diseases || 'Not provided'}</span>
          </div>
          <div>
            <strong>Treatment:</strong> <span>{patientDetails.treatment || 'Not provided'}</span>
          </div>
          <div>
            <strong>Discharge Date:</strong> <span>{patientDetails.discharge_date || 'Not provided'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
