import React from 'react';
import { useAppContext } from '../../context/AppContext';

const ViewPatients = () => {
  const { setPatientId, setContent, patients, loading, error } = useAppContext();

  const handleConditionClick = (patientId) => {
    setPatientId(patientId);
    setContent("updatetreatments");
  };

  const handleTreatmentsClick = (patientId) => {
    setPatientId(patientId);
    setContent("PatientTreatmentView");
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-cyan-800">All Patient Details</h2>

      {loading && <p className="text-gray-600">Loading patients...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && patients.length === 0 && (
        <p className="text-gray-600">No patient details available.</p>
      )}

      {!loading && patients.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-sm table-auto">
            <thead>
              <tr className="bg-blue-100 text-cyan-800">
                <th className="p-3 border border-blue-200">Patient Name</th>
                <th className="p-3 border border-blue-200">Age</th>
                <th className="p-3 border border-blue-200">Date of Birth</th>
                <th className="p-3 border border-blue-200">Admission Date</th>
                <th className="p-3 border border-blue-200">Add Condition</th>
                <th className="p-3 border border-blue-200">Treatment History</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="text-center transition-colors even:bg-gray-50">
                  <td className="p-3 border">{patient.name}</td>
                  <td className="p-3 border">{patient.age}</td>
                  <td className="p-3 border">{patient.dob}</td>
                  <td className="p-3 border">{patient.admit_date}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleConditionClick(patient.id)}
                      className="px-3 py-1 text-white transition-transform duration-200 bg-teal-600 rounded shadow-sm hover:bg-cyan-700 hover:scale-110"
                    >
                      Add Condition
                    </button>
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleTreatmentsClick(patient.id)}
                      className="px-3 py-1 text-white transition-transform duration-200 rounded shadow-sm bg-sky-600 hover:bg-emerald-700 hover:scale-110"
                    >
                      View Prescriptions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewPatients;
