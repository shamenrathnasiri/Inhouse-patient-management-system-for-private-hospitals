import React, { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';

const GeneratePDF = () => {
  const { patientId, setContent } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGeneratePDF = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:5000/generate-pdf/${patientId}`, {
        responseType: 'blob', // Important for file downloads
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `patient_${patientId}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      setError("Failed to generate PDF report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-6 sm:flex-row sm:items-center">
  <button
    onClick={handleGeneratePDF}
    disabled={loading}
    className={`w-full sm:w-auto px-6 py-2 text-white font-semibold rounded-lg shadow transition duration-300 ${
      loading
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-indigo-700 transition-transform duration-200 hover:scale-110'
    }`}
  >
    {loading ? 'Generating PDF...' : 'Download Medical Report'}
  </button>

  <button
    onClick={() => setContent('patientcheck')}
    className="w-full px-6 py-2 font-semibold text-white transition-transform duration-300 bg-red-700 rounded-lg shadow hover:scale-110 sm:w-auto hover:bg-red-800 "
  >
    Back to View Patients
  </button>

  {error && (
    <p className="mt-2 text-sm text-red-600 sm:mt-0 sm:ml-4">{error}</p>
  )}
</div>

  );
};

export default GeneratePDF
