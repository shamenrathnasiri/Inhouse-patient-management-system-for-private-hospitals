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
    <div className="max-w-6xl p-4 mx-auto">
      <h2 className="mb-8 text-3xl font-bold text-center text-blue-800">All Patient Details</h2>

      {loading && <p className="text-center text-gray-600">Loading patients...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && patients.length === 0 && (
        <p className="text-center text-gray-600">No patient details available.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {!loading && patients.length > 0 &&
          patients.map((patient) => (
            <div
              key={patient.id}
              className="p-6 transition-shadow duration-300 bg-white border border-gray-200 shadow-lg rounded-xl hover:shadow-2xl"
            >
              <h3 className="mb-2 text-xl font-semibold text-gray-800">{patient.name}</h3>
              <p className="mb-1 text-sm text-gray-600">Age: {patient.age}</p>
              <p className="mb-1 text-sm text-gray-600">Date of Birth: {patient.dob}</p>
              <p className="mb-1 text-sm text-gray-600">Admission Date: {patient.admit_date}</p>
              <p className="mb-3 text-sm text-gray-600">
                Discharge Date: {patient.discharge_date || 'N/A'}
              </p>

              <div className="p-3 mt-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="mb-2 font-semibold text-gray-700">Treatments</h4>
                {patient.treatments && patient.treatments.length > 0 ? (
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-600 border-b">
                        <th className="py-1 pr-2">Symptom</th>
                        <th className="py-1 pr-2">Condition</th>
                        <th className="py-1 pr-2">Date</th>
                        <th className="py-1">Prescription</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.treatments.map((treatment, index) => (
                        <tr key={index} className="text-gray-700">
                          <td className="py-1 pr-2">{treatment.symptom}</td>
                          <td className="py-1 pr-2">{treatment.condition}</td>
                          <td className="py-1 pr-2">{treatment.date}</td>
                          <td className="py-1">{treatment.prescription}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-center text-gray-500">No treatments available.</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PatientDetails;
