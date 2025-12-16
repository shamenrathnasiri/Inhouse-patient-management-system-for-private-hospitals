import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const ListPatient = () => {
  const { setPatientId, setContent, patients = [], loading, error } = useAppContext();

  const [searchName, setSearchName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleTreatmentsClick = (patientId) => {
    setPatientId(patientId);
    setContent('viewtreatments');
  };

  const handleDelete = (patientId) => {
    setPatientId(patientId);
    setContent('deletepatient');
  };

  const handleGenerate = (patientId) => {
    setPatientId(patientId);
    setContent('discharge');
  };

  const exportAllPatients = () => {
    const rows = (patients || []).map((p) => ({
      id: p.id ?? '',
      name: p.name ?? '',
      age: p.age ?? '',
      dob: p.dob ?? '',
      admit_date: p.admit_date ?? '',
      discharge_date: (p.discharge_date || p.discharge || p.dischargeDate || p.discharge_on || p.dischargeOn) ? (p.discharge_date || p.discharge || p.dischargeDate || p.discharge_on || p.dischargeOn) : 'Null'
    }));
    exportCSV(rows, `patients_all_${new Date().toISOString().slice(0,10)}.csv`);
  };

  const exportCSV = (rows, filename = `patients_${new Date().toISOString().slice(0,10)}.csv`) => {
    const header = ['ID', 'Name', 'Age', 'DOB', 'Admission Date', 'Discharge Date'];
    const csv = [header, ...rows.map(r => [r.id, r.name, r.age, r.dob, r.admit_date, r.discharge_date])]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportByDateRange = () => {
    // if no dates selected, export all
    const s = startDate ? new Date(startDate) : null;
    const e = endDate ? new Date(endDate) : null;
    if (e) e.setHours(23,59,59,999);

    const rows = (patients || []).filter((p) => {
      if (!s && !e) return true;
      const admit = p.admit_date ? new Date(p.admit_date) : null;
      if (!admit) return false;
      if (s && admit < s) return false;
      if (e && admit > e) return false;
      return true;
    }).map((p) => ({
      id: p.id ?? '',
      name: p.name ?? '',
      age: p.age ?? '',
      dob: p.dob ?? '',
      admit_date: p.admit_date ?? '',
      discharge_date: (p.discharge_date || p.discharge || p.dischargeDate || p.discharge_on || p.dischargeOn) ? (p.discharge_date || p.discharge || p.dischargeDate || p.discharge_on || p.dischargeOn) : 'Null'
    }));

    const filename = s || e
      ? `patients_${s ? s.toISOString().slice(0,10) : 'from'}_to_${e ? e.toISOString().slice(0,10) : 'to'}.csv`
      : `patients_all_${new Date().toISOString().slice(0,10)}.csv`;

    exportCSV(rows, filename);
  };

  const exportByDateRangeXLSX = async () => {
    // prepare rows same as CSV
    const s = startDate ? new Date(startDate) : null;
    const e = endDate ? new Date(endDate) : null;
    if (e) e.setHours(23,59,59,999);

    const rows = (patients || []).filter((p) => {
      if (!s && !e) return true;
      const admit = p.admit_date ? new Date(p.admit_date) : null;
      if (!admit) return false;
      if (s && admit < s) return false;
      if (e && admit > e) return false;
      return true;
    }).map((p) => {
      const rawDischarge = p.discharge_date || p.discharge || p.dischargeDate || p.discharge_on || p.dischargeOn;
      const exportedDischarge = rawDischarge ? rawDischarge : 'Null';
      const statusText = rawDischarge ? `Discharged: ${rawDischarge}` : 'Admitted';
      return {
        ID: p.id ?? '',
        Name: p.name ?? '',
        Age: p.age ?? '',
        DOB: p.dob ?? '',
        'Admission Date': p.admit_date ?? '',
        'Discharge Date': exportedDischarge,
        Status: statusText,
      };
    });

    // prepare filename and range text for both try and catch scopes
    const hospitalName = 'City general hospital';
    const createdDate = new Date().toLocaleString();
    const rangeText = s || e ? `${s ? s.toISOString().slice(0,10) : 'from'} to ${e ? e.toISOString().slice(0,10) : 'to'}` : '';
    const filename = s || e
      ? `patients_${s ? s.toISOString().slice(0,10) : 'from'}_to_${e ? e.toISOString().slice(0,10) : 'to'}.xlsx`
      : `patients_all_${new Date().toISOString().slice(0,10)}.xlsx`;

    try {
      const XLSX = await import('xlsx');

      // Build array-of-arrays: metadata rows, blank, header, then data rows
      const aoa = [];
      aoa.push(['Patient List Report']);
      aoa.push(['Hospital:', hospitalName]);
      aoa.push(['Created date:', createdDate]);
      if (rangeText) aoa.push(['Date range:', rangeText]);
      aoa.push([]);

      const headers = ['ID', 'Name', 'Age', 'DOB', 'Admission Date', 'Discharge Date', 'Status'];
      aoa.push(headers);
      for (const r of rows) {
        aoa.push([r.ID, r.Name, r.Age, r.DOB, r['Admission Date'], r['Discharge Date'], r['Status']]);
      }

      const ws = XLSX.utils.aoa_to_sheet(aoa);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Patients');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      // fallback to CSV if xlsx not available
      const fallbackRows = rows.map(r => ({
        id: r.ID,
        name: r.Name,
        age: r.Age,
        dob: r.DOB,
        admit_date: r['Admission Date'],
        discharge_date: r['Discharge Date'],
        status: r['Status'],
      }));

      // build csv with metadata similar to ViewPatients
      const csvLines = [];
      csvLines.push(`"Patient List Report"`);
      csvLines.push(`Hospital: "${hospitalName.replace(/"/g, '""')}"`);
      csvLines.push(`Created date: "${String(createdDate).replace(/"/g, '""')}"`);
      if (s || e) csvLines.push(`Date range: "${String(rangeText).replace(/"/g, '""')}"`);
      csvLines.push('');
      const header = ['ID', 'Name', 'Age', 'DOB', 'Admission Date', 'Discharge Date', 'Status'];
      csvLines.push(header.join(','));
      for (const r of fallbackRows) {
        const rowArr = [r.id, r.name, r.age, r.dob, r.admit_date, r.discharge_date, r.status];
        csvLines.push(rowArr.map(c => `"${String(c || '').replace(/"/g, '""') }"`).join(','));
      }
      const csv = '\uFEFF' + csvLines.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename.replace('.xlsx', '.csv');
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  };

  // compute filtered patients for table (search + date range)
  const filteredPatients = (patients || []).filter((patient) => {
    const nameMatch = searchName
      ? (patient.name || '').toLowerCase().includes(searchName.trim().toLowerCase())
      : true;

    if (!startDate && !endDate) return nameMatch;

    const admit = patient.admit_date ? new Date(patient.admit_date) : null;
    if (!admit) return nameMatch;

    let afterStart = true;
    let beforeEnd = true;
    if (startDate) {
      const s = new Date(startDate);
      afterStart = admit >= s;
    }
    if (endDate) {
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      beforeEnd = admit <= e;
    }
    return nameMatch && afterStart && beforeEnd;
  });

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-cyan-800">All Patient Details</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={exportByDateRangeXLSX}
            className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-sm"
            title="Export selected date range to Excel (xlsx) - exports all if no range selected"
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12m0 0l4-4m-4 4-4-4M21 21H3" />
            </svg>
            <span className="hidden sm:inline">Export Excel</span>
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-600">Loading patients...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && patients.length === 0 && (
        <p className="text-gray-600">No patient details available.</p>
      )}

      {/* Filters */}
      {!loading && patients.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-3 items-center">
          <div className="relative">
            <button
              type="button"
              onClick={() => document.getElementById('patient-search')?.focus()}
              className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
              aria-label="Focus search"
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
              </svg>
            </button>
            <input
              id="patient-search"
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search by name"
              className="px-3 py-2 pl-10 border rounded w-48 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            />
          </div>
          <label className="text-sm text-gray-600">from</label>
          <div className="relative">
            <svg className="w-5 h-5 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 pl-9 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-200"
            />
          </div>
          <label className="text-sm text-gray-600">to</label>
          <div className="relative">
            <svg className="w-5 h-5 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 pl-9 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-200"
            />
          </div>
          <button
            onClick={() => {
              setSearchName('');
              setStartDate('');
              setEndDate('');
            }}
            className="px-3 py-1 text-white bg-gray-600 rounded flex items-center gap-2 hover:bg-gray-700"
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        </div>
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
                <th className="p-3 border border-blue-200">Status</th>
                <th className="p-3 border border-blue-200">View Condition</th>
                <th className="p-3 border border-blue-200">Medical Report</th>
                <th className="p-3 border border-blue-200">Remove</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-600">
                    No patients match filters.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const dischargeDate =
                    patient.discharge_date || patient.discharge || patient.dischargeDate || patient.discharge_on || patient.dischargeOn;
                  return (
                    <tr key={patient.id} className="text-center transition-colors even:bg-gray-50">
                      <td className="p-3 border">{patient.name}</td>
                      <td className="p-3 border">{patient.age}</td>
                      <td className="p-3 border">{patient.dob}</td>
                      <td className="p-3 border">{patient.admit_date}</td>
                      <td className="p-3 border">
                        {dischargeDate ? (
                          <span className="px-2 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded">
                            Discharged: {dischargeDate}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-sm font-semibold text-yellow-800 bg-yellow-100 rounded">
                            Admitted
                          </span>
                        )}
                      </td>
                      <td className="p-3 border">
                        <button
                          onClick={() => handleTreatmentsClick(patient.id)}
                          className="px-3 py-1 text-white transition-transform duration-200 bg-teal-600 rounded shadow-sm hover:scale-110 hover:bg-cyan-700 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="hidden sm:inline">Patient Condition</span>
                        </button>
                      </td>
                      <td className="p-3 border">
                        <button
                          onClick={() => handleGenerate(patient.id)}
                          className="px-3 py-1 text-white transition-transform duration-200 bg-green-600 rounded shadow-sm hover:bg-green-700 hover:scale-110 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8" />
                          </svg>
                          <span className="hidden sm:inline">Generate</span>
                        </button>
                      </td>
                      <td className="p-3 border">
                        <button
                          onClick={() => handleDelete(patient.id)}
                          className="px-3 py-1 text-white transition-transform duration-200 bg-red-600 rounded shadow-sm hover:bg-red-700 hover:scale-110 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                          </svg>
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListPatient;
