import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientDetails = () => {
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
              <th className="p-2 border">Discharge Date</th>
              <th className="p-2 border">Treatments</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="border-b">
                <td className="p-2">{patient.name}</td>
                <td className="p-2">{patient.age}</td>
                <td className="p-2">{patient.dob}</td>
                <td className="p-2">{patient.admit_date}</td>
                <td className="p-2">{patient.discharge_date || 'N/A'}</td>
                <td className="p-2">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-1 border">Symptom</th>
                        <th className="p-1 border">Condition</th>
                        <th className="p-1 border">Date</th>
                        <th className="p-1 border">Prescription</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.treatments && patient.treatments.length > 0 ? (
                        patient.treatments.map((treatment, index) => (
                          <tr key={index}>
                            <td className="p-1 border">{treatment.symptom}</td>
                            <td className="p-1 border">{treatment.condition}</td>
                            <td className="p-1 border">{treatment.date}</td>
                            <td className="p-1 border">{treatment.prescription}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="p-1 text-center border">No treatments available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientDetails;
