import React, { useState, useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
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

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterApplied, setFilterApplied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = useMemo(() => {
    const list = patients || [];

    // apply search by name first (case-insensitive)
    const searched = searchQuery
      ? list.filter((p) => (p.name || '').toLowerCase().includes(searchQuery.trim().toLowerCase()))
      : list;

    // if filter not applied, return search results
    if (!filterApplied) return searched;

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    return searched.filter((p) => {
      const admit = p.admit_date ? new Date(p.admit_date) : null;
      if (!admit) return false;
      if (from && to) return admit >= from && admit <= to;
      if (from) return admit >= from;
      if (to) return admit <= to;
      return true;
    });
  }, [patients, fromDate, toDate, filterApplied, searchQuery]);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-cyan-800">All Patient Details</h2>

        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-2 py-1 text-sm border rounded-md"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-2 py-1 text-sm border rounded-md"
            />
          </div>

          <div className="flex items-center gap-2 ml-0 sm:ml-2">
            <button
              onClick={() => { setFromDate(''); setToDate(''); setFilterApplied(false); }}
              className="px-3 py-1 text-sm font-medium bg-gray-200 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          </div>

          <div className="w-full sm:w-auto sm:ml-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search patient name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 pl-10 py-1 text-sm border rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {loading && <p className="text-gray-600">Loading patients...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && (!filteredPatients || filteredPatients.length === 0) && (
        <p className="text-gray-600">No patient details available.</p>
      )}

      {!loading && filteredPatients.length > 0 && (
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
              {filteredPatients.map((patient) => (
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
