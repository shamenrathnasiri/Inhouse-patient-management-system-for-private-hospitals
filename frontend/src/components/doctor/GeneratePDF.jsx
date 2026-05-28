import React, { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { FaFileDownload, FaArrowLeft, FaFilePdf } from 'react-icons/fa';

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
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20">
          <FaFilePdf className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Medical Report</h2>
          <p className="text-sm text-dark-400">Generate and download patient report</p>
        </div>
      </div>

      <div className="glass-card p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-500/10 border border-primary-500/20">
            <FaFileDownload className="w-7 h-7 text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Download Medical Report</h3>
          <p className="text-sm text-dark-400">
            Generate a comprehensive PDF report containing all patient details, treatment history, and discharge information.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={handleGeneratePDF}
            disabled={loading}
            className={`flex items-center justify-center gap-2 ${
              loading ? 'btn-secondary cursor-not-allowed opacity-60' : 'btn-primary'
            }`}
          >
            <FaFileDownload className="w-4 h-4" />
            {loading ? 'Generating PDF...' : 'Download Medical Report'}
          </button>

          <button
            onClick={() => setContent('patientcheck')}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to View Patients
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratePDF
