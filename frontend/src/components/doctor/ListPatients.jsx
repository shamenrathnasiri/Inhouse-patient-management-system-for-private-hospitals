import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { FaUsers, FaSearch, FaFilePdf, FaFileExcel, FaTimes, FaEye, FaPlusCircle, FaTrashAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  const exportToPDF = () => {
    const s = startDate ? new Date(startDate) : null;
    const e = endDate ? new Date(endDate) : null;
    if (e) e.setHours(23,59,59,999);

    const rows = (patients || []).filter((p) => {
      const nameMatch = searchName
        ? (p.name || '').toLowerCase().includes(searchName.trim().toLowerCase())
        : true;
      if (!s && !e) return nameMatch;
      const admit = p.admit_date ? new Date(p.admit_date) : null;
      if (!admit) return nameMatch;
      let afterStart = true;
      let beforeEnd = true;
      if (s) afterStart = admit >= s;
      if (e) beforeEnd = admit <= e;
      return nameMatch && afterStart && beforeEnd;
    }).map((p) => {
      const rawDischarge = p.discharge_date || p.discharge || p.dischargeDate || p.discharge_on || p.dischargeOn;
      return [
        p.id ?? '',
        p.name ?? '',
        p.age ?? '',
        p.dob ?? '',
        p.admit_date ?? '',
        rawDischarge ? rawDischarge : 'Not Yet',
        rawDischarge ? 'Discharged' : 'Admitted'
      ];
    });

    const doc = new jsPDF();
    const hospitalName = 'City General Hospital';
    const currentDate = new Date().toLocaleString();
    const pageWidth = doc.internal.pageSize.width;

    // Add header background
    doc.setFillColor(14, 116, 144); // cyan-800
    doc.rect(0, 0, pageWidth, 35, 'F');

    // Add hospital name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(hospitalName, pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Patient Details Report', pageWidth / 2, 25, { align: 'center' });

    // Add metadata
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${currentDate}`, 14, 45);
    if (s || e) {
      const rangeText = `Date Range: ${s ? s.toISOString().slice(0,10) : 'from'} to ${e ? e.toISOString().slice(0,10) : 'to'}`;
      doc.text(rangeText, 14, 52);
    }

    // Add table
    autoTable(doc, {
      startY: (s || e) ? 58 : 52,
      head: [['ID', 'Name', 'Age', 'DOB', 'Admission', 'Discharge', 'Status']],
      body: rows,
      theme: 'striped',
      headStyles: {
        fillColor: [14, 116, 144],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [240, 249, 255]
      },
      margin: { top: 10, left: 14, right: 14 }
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    const filename = s || e
      ? `patients_${s ? s.toISOString().slice(0,10) : 'from'}_to_${e ? e.toISOString().slice(0,10) : 'to'}.pdf`
      : `patients_all_${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(filename);
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
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <FaUsers className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">All Patient Details</h2>
            <p className="text-sm text-dark-400">{filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} found</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportToPDF}
            className="btn-danger flex items-center gap-2 px-4 py-2 text-sm"
            title="Export selected patients to PDF"
            id="export-pdf-btn"
          >
            <FaFilePdf className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
          <button
            onClick={exportByDateRangeXLSX}
            className="btn-accent flex items-center gap-2 px-4 py-2 text-sm"
            title="Export selected date range to Excel (xlsx)"
            id="export-xlsx-btn"
          >
            <FaFileExcel className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Excel</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-500 w-3.5 h-3.5" />
            <input
              id="patient-search"
              type="search"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="input-field pl-10 py-2.5 text-sm"
            />
            {searchName && (
              <button
                type="button"
                onClick={() => setSearchName('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                aria-label="Clear search"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-dark-500">From</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field py-2 px-3 text-sm w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-dark-500">To</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field py-2 px-3 text-sm w-auto"
            />
          </div>

          <button
            onClick={() => {
              setSearchName('');
              setStartDate('');
              setEndDate('');
            }}
            className="btn-secondary px-4 py-2 text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <svg className="w-8 h-8 text-primary-400 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="ml-3 text-dark-400">Loading patients...</span>
        </div>
      )}
      {error && <p className="py-4 text-center text-red-400">{error}</p>}

      {!loading && patients.length === 0 && (
        <div className="glass-card p-12 text-center">
          <FaUsers className="w-12 h-12 mx-auto mb-4 text-dark-700" />
          <p className="text-dark-400">No patient details available.</p>
        </div>
      )}

      {/* Table */}
      {!loading && patients.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Date of Birth</th>
                  <th>Admission Date</th>
                  <th>Status</th>
                  <th>View Condition</th>
                  <th>Medical Report</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-dark-500">
                      No patients match filters.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient, idx) => {
                    const dischargeDate =
                      patient.discharge_date || patient.discharge || patient.dischargeDate || patient.discharge_on || patient.dischargeOn;
                    return (
                      <tr key={patient.id} className="animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                        <td className="font-medium text-white">{patient.name}</td>
                        <td>{patient.age}</td>
                        <td>{patient.dob}</td>
                        <td>
                          <span className="badge badge-info">{patient.admit_date}</span>
                        </td>
                        <td>
                          {dischargeDate ? (
                            <span className="badge badge-success">
                              Discharged: {dischargeDate}
                            </span>
                          ) : (
                            <span className="badge badge-warning">
                              Admitted
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleTreatmentsClick(patient.id)}
                            className="btn-primary flex items-center gap-2 px-3 py-1.5 text-xs"
                          >
                            <FaEye className="w-3 h-3" />
                            <span className="hidden sm:inline">Patient Condition</span>
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => handleGenerate(patient.id)}
                            className="btn-accent flex items-center gap-2 px-3 py-1.5 text-xs"
                          >
                            <FaPlusCircle className="w-3 h-3" />
                            <span className="hidden sm:inline">Generate</span>
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(patient.id)}
                            className="btn-danger flex items-center gap-2 px-3 py-1.5 text-xs"
                          >
                            <FaTrashAlt className="w-3 h-3" />
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
        </div>
      )}
    </div>
  );
};

export default ListPatient;
