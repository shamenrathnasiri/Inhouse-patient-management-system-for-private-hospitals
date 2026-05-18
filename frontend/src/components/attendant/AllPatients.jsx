import React, { useState, useMemo } from 'react';
import { FaSearch, FaFilePdf, FaFileCsv, FaUsers, FaTimes } from 'react-icons/fa';
import { useAppContext } from '../../context/AppContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AllPatients = () => {
  const { patients, loading, error } = useAppContext();

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterApplied, setFilterApplied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = useMemo(() => {
    const list = patients || [];

    const searched = searchQuery
      ? list.filter((p) => (p.name || '').toLowerCase().includes(searchQuery.trim().toLowerCase()))
      : list;

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

  const exportToPDF = () => {
    const rows = filteredPatients.map((p) => [
      p.name || '',
      p.age || '',
      p.dob || '',
      p.admit_date || ''
    ]);

    if (rows.length === 0) {
      alert('No patients to export');
      return;
    }

    const doc = new jsPDF();
    const hospitalName = 'City General Hospital';
    const currentDate = new Date().toLocaleString();
    const pageWidth = doc.internal.pageSize.width;

    doc.setFillColor(14, 116, 144);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(hospitalName, pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Patient Details Report (Attendant)', pageWidth / 2, 25, { align: 'center' });

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${currentDate}`, 14, 45);
    if (fromDate || toDate) {
      const rangeText = `Date Range: ${fromDate || 'from'} to ${toDate || 'to'}`;
      doc.text(rangeText, 14, 52);
    }

    autoTable(doc, {
      startY: (fromDate || toDate) ? 58 : 52,
      head: [['Patient Name', 'Age', 'Date of Birth', 'Admission Date']],
      body: rows,
      theme: 'striped',
      headStyles: {
        fillColor: [14, 116, 144],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11
      },
      styles: {
        fontSize: 10,
        cellPadding: 4
      },
      alternateRowStyles: {
        fillColor: [240, 249, 255]
      },
      margin: { top: 10, left: 14, right: 14 }
    });

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

    const safeHospital = hospitalName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    doc.save(`${safeHospital}_patients_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToCSV = () => {
    const rows = filteredPatients.map((p) => ({
      'Patient name': p.name || '',
      Age: p.age || '',
      'Date of birth': p.dob || '',
      'Admission date': p.admit_date || '',
    }));

    if (rows.length === 0) return;

    const headers = ['Patient name', 'Age', 'Date of birth', 'Admission date'];
    const csvLines = [];

    const hospitalName = 'City general hospital';
    const createdDate = new Date().toLocaleString();

    csvLines.push(`"Patient List Report"`);
    csvLines.push(`Hospital: "${hospitalName.replace(/"/g, '""')}"`);
    csvLines.push(`Created date: "${String(createdDate).replace(/"/g, '""')}"`);
    csvLines.push('');

    csvLines.push(headers.join(','));

    for (const r of rows) {
      const line = headers
        .map((h) => `"${String(r[h] || '').replace(/"/g, '""')}"`)
        .join(',');
      csvLines.push(line);
    }

    const csv = csvLines.join('\n');
    const csvWithBOM = '\uFEFF' + csv;
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeHospital = hospitalName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    a.download = `${safeHospital}_patients_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <FaUsers className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">All Patients</h2>
            <p className="text-sm text-dark-400">{filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} found</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={exportToPDF} className="btn-danger flex items-center gap-2 px-4 py-2 text-sm" id="export-pdf-btn">
            <FaFilePdf className="w-3.5 h-3.5" />
            Export PDF
          </button>
          <button onClick={exportToCSV} className="btn-accent flex items-center gap-2 px-4 py-2 text-sm" id="export-csv-btn">
            <FaFileCsv className="w-3.5 h-3.5" />
            Export CSV
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
              type="search"
              placeholder="Search patient name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 py-2.5 text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
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
              value={fromDate}
              onChange={(e) => { setFromDate(e.target.value); setFilterApplied(true); }}
              className="input-field py-2 px-3 text-sm w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-dark-500">To</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => { setToDate(e.target.value); setFilterApplied(true); }}
              className="input-field py-2 px-3 text-sm w-auto"
            />
          </div>

          <button
            onClick={() => { setFromDate(''); setToDate(''); setFilterApplied(false); setSearchQuery(''); }}
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

      {!loading && (!filteredPatients || filteredPatients.length === 0) && (
        <div className="glass-card p-12 text-center">
          <FaUsers className="w-12 h-12 mx-auto mb-4 text-dark-700" />
          <p className="text-dark-400">No patient details available.</p>
        </div>
      )}

      {/* Table */}
      {!loading && filteredPatients.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Date of Birth</th>
                  <th>Admission Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, idx) => (
                  <tr key={patient.id} className="animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                    <td className="font-medium text-white">{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.dob}</td>
                    <td>
                      <span className="badge badge-info">{patient.admit_date}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPatients;
