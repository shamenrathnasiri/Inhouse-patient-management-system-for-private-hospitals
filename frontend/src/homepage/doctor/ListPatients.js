import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';



const ListPatient = () => {
    const {setPatientId , setContent } = useAppContext();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patients/all-details');
        setPatients(response.data);
      } catch (error) {
        setError('Failed to fetch patient data.');
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleTreatmentsClick = (patientId) => {
    setPatientId(patientId);
    setContent("viewtreatments");
    };

  return (
    <div className="patient-details-container">
      <h2 className="mb-4 text-2xl font-bold">All Patient Details</h2>

      {loading && <p>Loading patients...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && patients.length === 0 && <p>No patient details available.</p>}

      {!loading && patients.length > 0 && (
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Patient Name</th>
              <th className="p-2 border">Age</th>
              <th className="p-2 border">Date of Birth</th>
              <th className="p-2 border">Admission Date</th>
              <th className="p-2 border">View Condition</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="border-b">
                <td className="p-2">{patient.name}</td>
                <td className="p-2">{patient.age}</td>
                <td className="p-2">{patient.dob}</td>
                <td className="p-2">{patient.admit_date}</td>
                <td className="p-2">
                <button
                    onClick={() => handleTreatmentsClick(patient.id)}
                    className="p-2 text-white bg-blue-500 rounded"
                  >
                    Patient Condition
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListPatient;
