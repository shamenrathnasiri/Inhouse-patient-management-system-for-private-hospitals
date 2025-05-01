import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientDetails = ({ getPatients, setId }) => {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState('');

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
  }, [getPatients]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!patientId) return;
      try {
        const response = await axios.get(`http://localhost:5000/patients/${patientId}`);
        setPatientDetails(response.data);
      } catch (err) {
        setError('❌ Error fetching updated patient details');
      }
    };
    fetchDetails();
  }, [getPatients, patientId]);
  

  const handleFetchDetails = async () => {
    if (!patientId) {
      setError('⚠️ Please select a patient');
      return;
    }

    try {
      setId(patientId);
      const response = await axios.get(`http://localhost:5000/patients/${patientId}`);
      setPatientDetails(response.data);
      setError('');
    } catch (err) {
      setError('❌ Error fetching patient details');
      setPatientDetails(null);
    }
  };

  return (
    <div className="flex justify-center min-h-screen p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-xl p-8 transform transition-all duration-500 hover:scale-[1.01]">
        <h2 className="mb-6 text-3xl font-bold text-center text-purple-700">🔍 Patient Details Viewer</h2>

        <div className="mb-6">
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">-- Select a patient --</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} (ID: {patient.id})
              </option>
            ))}
          </select>

          <button
            onClick={handleFetchDetails}
            className="w-full px-4 py-2 mt-4 font-semibold text-white transition duration-300 rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            select Patient
          </button>
        </div>

        {error && <p className="font-medium text-center text-red-600">{error}</p>}

        {patientDetails && (
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm text-left border border-gray-300">
              <thead className="text-gray-700 bg-purple-100 text-md">
                <tr>
                  <th className="p-3 border">Field</th>
                  <th className="p-3 border">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr><td className="p-3 border">Name</td><td className="p-3 border">{patientDetails.name}</td></tr>
                <tr><td className="p-3 border">Age</td><td className="p-3 border">{patientDetails.age}</td></tr>
                <tr><td className="p-3 border">Date of Birth</td><td className="p-3 border">{patientDetails.dob}</td></tr>
                <tr><td className="p-3 border">Admit Date</td><td className="p-3 border">{patientDetails.admit_date}</td></tr>

                {/* Symptoms */}
                <tr>
                  <td className="p-3 border">Symptoms</td>
                  <td className="p-3 border">
                    {patientDetails.symptoms && patientDetails.symptoms.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {patientDetails.symptoms.map((symptom, index) => (
                          <li key={index}>
                            {symptom.description} (Date: {symptom.date})
                          </li>
                        ))}
                      </ul>
                    ) : 'Not provided'}
                  </td>
                </tr>

                {/* Conditions */}
                <tr>
                  <td className="p-3 border">Conditions</td>
                  <td className="p-3 border">
                    {patientDetails.conditions && patientDetails.conditions.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {patientDetails.conditions.map((condition, index) => (
                          <li key={index}>
                            {condition.description} (Date: {condition.date})
                          </li>
                        ))}
                      </ul>
                    ) : 'Not provided'}
                  </td>
                </tr>

                <tr><td className="p-3 border">Diseases</td><td className="p-3 border">{patientDetails.diseases || 'Not provided'}</td></tr>
                <tr><td className="p-3 border">Treatment</td><td className="p-3 border">{patientDetails.treatment || 'Not provided'}</td></tr>
                <tr><td className="p-3 border">Discharge Date</td><td className="p-3 border">{patientDetails.discharge_date || 'Not provided'}</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
