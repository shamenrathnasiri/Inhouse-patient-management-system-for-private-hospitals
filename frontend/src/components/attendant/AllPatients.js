import React from 'react';
import { useAppContext } from '../../context/AppContext';

const AllPatients = () => {
  const { patients, loading, error } = useAppContext();

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-blue-600">All Patient Details</h2>

      {loading && <p className="text-gray-600">Loading patients...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && patients.length === 0 && (
        <p className="text-gray-600">No patient details available.</p>
      )}

      {!loading && patients.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-sm table-auto">
            <thead>
              <tr className="text-blue-800 bg-blue-100">
                <th className="p-3 border border-blue-200">Patient Name</th>
                <th className="p-3 border border-blue-200">Age</th>
                <th className="p-3 border border-blue-200">Date of Birth</th>
                <th className="p-3 border border-blue-200">Admission Date</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="text-center transition-colors even:bg-gray-50">
                  <td className="p-3 border">{patient.name}</td>
                  <td className="p-3 border">{patient.age}</td>
                  <td className="p-3 border">{patient.dob}</td>
                  <td className="p-3 border">{patient.admit_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllPatients;
