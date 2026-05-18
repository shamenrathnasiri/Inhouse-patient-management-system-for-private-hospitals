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
    <div className="animate-fade-in-up">
      <h2 className="mb-8 text-3xl font-bold text-center text-white">All Patient Details</h2>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <svg className="w-8 h-8 text-primary-400 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="ml-3 text-dark-400">Loading patients...</span>
        </div>
      )}
      {error && <p className="text-center text-red-400">{error}</p>}
      {!loading && patients.length === 0 && (
        <p className="text-center text-dark-400">No patient details available.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {!loading && patients.length > 0 &&
          patients.map((patient, idx) => (
            <div
              key={patient.id}
              className="glass-card p-6 transition-all duration-300 hover:border-primary-500/20 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <h3 className="mb-3 text-lg font-semibold text-white">{patient.name}</h3>
              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                <div>
                  <span className="text-dark-500">Age:</span>
                  <span className="ml-2 text-dark-200">{patient.age}</span>
                </div>
                <div>
                  <span className="text-dark-500">DOB:</span>
                  <span className="ml-2 text-dark-200">{patient.dob}</span>
                </div>
                <div>
                  <span className="text-dark-500">Admitted:</span>
                  <span className="ml-2 text-dark-200">{patient.admit_date}</span>
                </div>
                <div>
                  <span className="text-dark-500">Discharged:</span>
                  <span className="ml-2 text-dark-200">{patient.discharge_date || 'N/A'}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-dark-900/50 border border-dark-800/50">
                <h4 className="mb-3 text-sm font-semibold text-dark-300">Treatments</h4>
                {patient.treatments && patient.treatments.length > 0 ? (
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-dark-500 border-b border-dark-700/50">
                        <th className="py-2 pr-2">Symptom</th>
                        <th className="py-2 pr-2">Condition</th>
                        <th className="py-2 pr-2">Date</th>
                        <th className="py-2">Prescription</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.treatments.map((treatment, index) => (
                        <tr key={index} className="text-dark-300 border-b border-dark-800/30">
                          <td className="py-2 pr-2">{treatment.symptom}</td>
                          <td className="py-2 pr-2">{treatment.condition}</td>
                          <td className="py-2 pr-2">{treatment.date}</td>
                          <td className="py-2">{treatment.prescription}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-xs text-center text-dark-500">No treatments available.</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PatientDetails;
