import React from 'react';
import { useAppContext } from '../../context/AppContext';

const ListPatient = () => {
  const { setPatientId, setContent, patients, loading, error } = useAppContext();

  const handleTreatmentsClick = (patientId) => {
    setPatientId(patientId);
    setContent("viewtreatments");
  };

  const handleDelete = (patientId) => {
    setPatientId(patientId);
    setContent("deletepatient");
  };

  const handleGenerate = (patientId) => {
    setPatientId(patientId);
    setContent("discharge");
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
                <th className="p-3 border border-blue-200">View Condition</th>
                <th className="p-3 border border-blue-200">Medical Report</th>
                <th className="p-3 border border-blue-200">Remove</th>
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
                      onClick={() => handleTreatmentsClick(patient.id)}
                      className="px-3 py-1 text-white transition-transform duration-200 bg-teal-600 rounded shadow-sm hover:scale-110 hover:bg-cyan-700"
                    >
                      Patient Condition
                    </button>
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleGenerate(patient.id)}
                      className="px-3 py-1 text-white transition-transform duration-200 bg-green-600 rounded shadow-sm hover:bg-green-700 hover:scale-110"
                    >
                      Generate
                    </button>
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="px-3 py-1 text-white transition-transform duration-200 bg-red-600 rounded shadow-sm hover:bg-red-700 hover:scale-110"
                    >
                      Delete
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

export default ListPatient;
