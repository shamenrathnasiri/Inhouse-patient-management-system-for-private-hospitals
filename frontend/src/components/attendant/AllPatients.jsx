import React, { useState, useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
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
    doc.text('Patient Details Report (Attendant)', pageWidth / 2, 25, { align: 'center' });

    // Add metadata
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${currentDate}`, 14, 45);
    if (fromDate || toDate) {
      const rangeText = `Date Range: ${fromDate || 'from'} to ${toDate || 'to'}`;
      doc.text(rangeText, 14, 52);
    }

    // Add table
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

    if (rows.length === 0) {
      // nothing to export
      return;
    }

    const headers = ['Patient name', 'Age', 'Date of birth', 'Admission date'];
    const csvLines = [];

    // add metadata: Hospital name and Created date
    const hospitalName = 'City general hospital';
    const createdDate = new Date().toLocaleString();

    // clear title + metadata for readability in Excel
    csvLines.push(`"Patient List Report"`);
    csvLines.push(`Hospital: "${hospitalName.replace(/"/g, '""')}"`);
    csvLines.push(`Created date: "${String(createdDate).replace(/"/g, '""')}"`);
    csvLines.push('');

    // header row (column titles)
    csvLines.push(headers.join(','));

    for (const r of rows) {
      const line = headers
        .map((h) => `"${String(r[h] || '').replace(/"/g, '""')}"`)
        .join(',');
      csvLines.push(line);
    }

    const csv = csvLines.join('\n');
    // prepend UTF-8 BOM so Excel recognizes UTF-8 and displays correctly
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
    <div className="p-6 bg-white rounded shadow-md">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-cyan-600">All Patient Details</h2>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col w-full gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-72">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search patient name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 pl-10 py-1 text-sm border rounded-md"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 bg-gray-100 rounded-full p-1"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

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

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setFromDate(''); setToDate(''); setFilterApplied(false); setSearchQuery(''); }}
                className="px-3 py-1 text-sm font-medium bg-gray-200 rounded hover:bg-gray-300"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <button
              onClick={exportToPDF}
              className="px-6 py-1 ml-2 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Export PDF
            </button>
            <button
              onClick={exportToCSV}
              className="px-6 py-1 text-sm font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Export CSV
            </button>
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
              <tr className="text-blue-800 bg-blue-100">
                <th className="p-3 border border-blue-200">Patient Name</th>
                <th className="p-3 border border-blue-200">Age</th>
                <th className="p-3 border border-blue-200">Date of Birth</th>
                <th className="p-3 border border-blue-200">Admission Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
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
