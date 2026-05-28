import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { FaClipboardList, FaArrowLeft, FaFileDownload } from 'react-icons/fa';

const PatientTreatmentView = () => {
  const { patientId ,setContent} = useAppContext();
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchTreatments = async () => {
      if (!patientId) {
        setErrorMsg('No patient ID found in context.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/view-treatments/${patientId}`);
        setTreatments(response.data.treatments);
      } catch (error) {
        if (error.response?.status === 404) {
          setErrorMsg('No treatments found for this patient.');
        } else {
          setErrorMsg('Failed to fetch treatments.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, [patientId]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <FaClipboardList className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Patient Treatment History</h2>
            <p className="text-sm text-dark-400">{treatments.length} treatment{treatments.length !== 1 ? 's' : ''} recorded</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <svg className="w-8 h-8 text-primary-400 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="ml-3 text-dark-400">Loading treatments...</span>
        </div>
      ) : errorMsg ? (
        <div className="glass-card p-12 text-center">
          <FaClipboardList className="w-12 h-12 mx-auto mb-4 text-dark-700" />
          <p className="text-red-400">{errorMsg}</p>
        </div>
      ) : treatments.length > 0 ? (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Symptom</th>
                  <th>Condition</th>
                  <th>Date</th>
                  <th>Prescription</th>
                </tr>
              </thead>
              <tbody>
                {treatments.map((t, index) => (
                  <tr key={t.id} className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                    <td className="font-medium text-white">{t.id}</td>
                    <td><span className="badge badge-info">{t.symptom}</span></td>
                    <td><span className="badge badge-purple">{t.condition}</span></td>
                    <td>{t.date}</td>
                    <td>
                      {t.prescription ? (
                        <span className="badge badge-success">{t.prescription}</span>
                      ) : (
                        <span className="text-dark-500">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <FaClipboardList className="w-12 h-12 mx-auto mb-4 text-dark-700" />
          <p className="text-dark-400">No treatments to display.</p>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex flex-col gap-3 mt-8 sm:flex-row">
        <button
          onClick={()=>setContent("viewpatients")}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={async () => {
            try {
              const res = await axios.get(`http://localhost:5000/generate-treatment-pdf/${patientId}`, { responseType: 'blob' });
              const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
              const a = document.createElement('a');
              a.href = url;
              a.download = `patient_${patientId}_treatments.pdf`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
            } catch (err) {
              console.error('Failed to download PDF', err);
            }
          }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <FaFileDownload className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PatientTreatmentView;
