import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import SignaturePad from './SignaturePad';
import { FaUserMd, FaArrowLeft, FaCheckCircle, FaTimes, FaNotesMedical, FaRobot, FaMagic, FaEdit, FaSync } from 'react-icons/fa';

const Discharge = () => {
  const { patientId, signature, setSigned, signed, setContent } = useAppContext();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discharging, setDischarging] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  // AI Report States
  const [aiReport, setAiReport] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/patients/${patientId}`);
        setPatient(response.data);
      } catch (err) {
        setError('Failed to fetch patient data.');
      } finally {
        setLoading(false);
      }
    };

    if (patientId) fetchPatient();
  }, [patientId]);

  // Generate AI Report
  const handleGenerateAIReport = useCallback(async () => {
    setAiLoading(true);
    setAiError(null);

    try {
      const response = await axios.post(`http://localhost:5000/ai/generate-report/${patientId}`);

      if (response.data.success) {
        setAiReport(response.data.report);
        setAiGenerated(true);
      } else {
        setAiError(response.data.error || 'Failed to generate AI report.');
      }
    } catch (err) {
      console.error('AI Report Error:', err);
      setAiError(
        err.response?.data?.error || 'Failed to connect to AI service. Please check your API key and try again.'
      );
    } finally {
      setAiLoading(false);
    }
  }, [patientId]);

  const handleDischarge = async () => {
    if (!signature) return;

    setDischarging(true);
    try {
      await axios.post(`http://localhost:5000/discharge/${patientId}`, {
        discharge_date: new Date().toISOString().slice(0, 10),
        doctor_signature: signature,
        ai_report: aiReport || null,
      });

      setSuccessMsg("Patient discharged successfully.");
      setSigned(false);
      setTimeout(() => {
        setContent("generatepdf");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Failed to discharge the patient.");
    } finally {
      setDischarging(false);
    }
  };

  const cancelbutton = () => {
    setContent("patientcheck");
    setSigned(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12 animate-fade-in">
      <svg className="w-8 h-8 text-primary-400 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span className="ml-3 text-dark-400">Loading patient data...</span>
    </div>
  );

  if (error && !patient) return (
    <div className="glass-card p-12 text-center animate-fade-in">
      <p className="text-red-400">{error}</p>
    </div>
  );

  if (!patient) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20">
            <FaUserMd className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Patient Discharge Details</h2>
            <p className="text-sm text-dark-400">Review and discharge patient</p>
          </div>
        </div>
        <button
          onClick={() => { setContent('patientcheck'); setSigned(false); }}
          className="btn-secondary flex items-center gap-2"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
          Back to All Patients
        </button>
      </div>

      {/* Patient Info Grid */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Patient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card-light p-4">
            <p className="text-xs font-medium text-dark-500 uppercase tracking-wider mb-1">Name</p>
            <p className="text-white font-medium">{patient.name}</p>
          </div>
          <div className="glass-card-light p-4">
            <p className="text-xs font-medium text-dark-500 uppercase tracking-wider mb-1">Age</p>
            <p className="text-white font-medium">{patient.age}</p>
          </div>
          <div className="glass-card-light p-4">
            <p className="text-xs font-medium text-dark-500 uppercase tracking-wider mb-1">Date of Birth</p>
            <p className="text-white font-medium">{patient.dob}</p>
          </div>
          <div className="glass-card-light p-4">
            <p className="text-xs font-medium text-dark-500 uppercase tracking-wider mb-1">Admit Date</p>
            <p className="text-white font-medium">{patient.admit_date}</p>
          </div>
          <div className="glass-card-light p-4 md:col-span-2">
            <p className="text-xs font-medium text-dark-500 uppercase tracking-wider mb-1">Discharge Date</p>
            <p className="text-white font-medium">
              {patient.discharge_date ? (
                <span className="badge badge-success">{patient.discharge_date}</span>
              ) : (
                <span className="badge badge-warning">Not yet discharged</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Treatment History */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FaNotesMedical className="w-5 h-5 text-accent-400" />
          <h3 className="text-lg font-semibold text-white">Treatment History</h3>
        </div>

        {patient.treatments.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-dark-400">No treatments recorded.</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table-premium">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Symptom</th>
                    <th>Condition</th>
                    <th>Prescription</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.treatments.map((t, index) => (
                    <tr key={index} className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                      <td>{t.date}</td>
                      <td><span className="badge badge-info">{t.symptom}</span></td>
                      <td><span className="badge badge-purple">{t.condition}</span></td>
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
        )}
      </div>

      {/* ===================== AI REPORT SECTION ===================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FaRobot className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">AI Medical Report</h3>
          <span className="badge" style={{
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(79, 70, 229, 0.2))',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            color: '#c084fc'
          }}>
            Powered by Gemini
          </span>
        </div>

        {/* AI Report Card */}
        <div
          className="glass-card overflow-hidden"
          style={{
            borderImage: 'linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(79, 70, 229, 0.15), rgba(147, 51, 234, 0.1)) 1',
            borderWidth: '1px',
            borderStyle: 'solid',
          }}
        >
          {/* AI Card Header */}
          <div
            className="px-6 py-4 border-b border-dark-800/50"
            style={{
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.12), rgba(79, 70, 229, 0.06))',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(79, 70, 229, 0.15))',
                    border: '1px solid rgba(147, 51, 234, 0.25)',
                  }}
                >
                  <FaMagic className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">AI-Generated Medical Summary</p>
                  <p className="text-xs text-dark-500">
                    {aiGenerated ? 'Report generated — review and edit before discharge' : 'Generate a professional medical report using AI'}
                  </p>
                </div>
              </div>

              {aiGenerated && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200"
                    style={{
                      background: isEditing ? 'rgba(147, 51, 234, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${isEditing ? 'rgba(147, 51, 234, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                      color: isEditing ? '#c084fc' : '#a1a1aa',
                    }}
                  >
                    <FaEdit className="w-3 h-3" />
                    {isEditing ? 'Preview' : 'Edit'}
                  </button>
                  <button
                    onClick={handleGenerateAIReport}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#a1a1aa',
                    }}
                    title="Regenerate report"
                  >
                    <FaSync className={`w-3 h-3 ${aiLoading ? 'animate-spin' : ''}`} />
                    Regenerate
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* AI Card Body */}
          <div className="p-6">
            {!aiGenerated && !aiLoading && (
              <div className="text-center py-8">
                <div
                  className="flex items-center justify-center w-20 h-20 mx-auto mb-5 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(79, 70, 229, 0.1))',
                    border: '1px solid rgba(147, 51, 234, 0.2)',
                  }}
                >
                  <FaRobot className="w-8 h-8 text-purple-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Generate AI Medical Report</h4>
                <p className="text-sm text-dark-400 mb-6 max-w-md mx-auto">
                  Use Google Gemini AI to automatically generate a professional medical summary
                  based on this patient's treatment history, symptoms, and conditions.
                </p>
                <button
                  onClick={handleGenerateAIReport}
                  disabled={aiLoading}
                  className="inline-flex items-center gap-2.5 px-8 py-3 font-semibold text-white rounded-xl shadow-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
                  style={{
                    background: 'linear-gradient(135deg, #9333ea, #4f46e5)',
                    boxShadow: '0 4px 20px rgba(147, 51, 234, 0.35)',
                  }}
                  id="ai-generate-btn"
                >
                  <FaMagic className="w-4 h-4" />
                  ✨ AI Generate Report
                </button>
              </div>
            )}

            {/* Loading State */}
            {aiLoading && (
              <div className="text-center py-10">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-5">
                  {/* Outer spinning ring */}
                  <div
                    className="absolute inset-0 rounded-full animate-spin"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent, rgba(147, 51, 234, 0.6), transparent)',
                      WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
                      mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
                    }}
                  />
                  {/* Inner icon */}
                  <div
                    className="flex items-center justify-center w-14 h-14 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(79, 70, 229, 0.15))',
                    }}
                  >
                    <FaRobot className="w-6 h-6 text-purple-400 animate-pulse" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-white mb-1">Generating Medical Report...</h4>
                <p className="text-sm text-dark-400">
                  AI is analyzing patient data and treatment history
                </p>
                <div className="flex justify-center gap-1 mt-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Error State */}
            {aiError && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-start gap-3">
                  <FaTimes className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-400">Failed to generate report</p>
                    <p className="text-xs text-red-400/70 mt-1">{aiError}</p>
                    <button
                      onClick={handleGenerateAIReport}
                      className="mt-3 text-xs font-medium text-red-400 underline hover:text-red-300 transition-colors"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Generated Report Display */}
            {aiGenerated && !aiLoading && (
              <div className="animate-fade-in">
                {isEditing ? (
                  <textarea
                    value={aiReport}
                    onChange={(e) => setAiReport(e.target.value)}
                    className="w-full min-h-[300px] p-4 bg-dark-900/60 border border-purple-500/20 rounded-xl text-dark-100 text-sm leading-relaxed font-mono placeholder-dark-500 transition-all duration-300 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/15 resize-y"
                    placeholder="Edit the AI-generated report..."
                    id="ai-report-editor"
                  />
                ) : (
                  <div
                    className="p-5 rounded-xl text-sm text-dark-200 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto"
                    style={{
                      background: 'rgba(19, 19, 31, 0.6)',
                      border: '1px solid rgba(147, 51, 234, 0.12)',
                    }}
                    id="ai-report-preview"
                  >
                    {aiReport}
                  </div>
                )}

                {/* Report Status Bar */}
                <div className="flex items-center justify-between mt-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs text-dark-500">
                      Report generated • {aiReport.split(/\s+/).length} words
                    </span>
                  </div>
                  <span className="text-xs text-dark-600">
                    {isEditing ? '✏️ Editing mode' : '👁️ Preview mode'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Signature input */}
      <div className="mt-8">
        <SignaturePad />
      </div>

      {/* Discharge Button */}
      {signed && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleDischarge}
            className={`flex items-center gap-2 ${
              discharging ? 'btn-secondary cursor-not-allowed opacity-60' : 'btn-accent'
            }`}
            disabled={discharging}
          >
            <FaCheckCircle className="w-4 h-4" />
            {discharging ? 'Discharging...' : 'Discharge & Save'}
          </button>

          <button
            onClick={cancelbutton}
            className="btn-secondary flex items-center gap-2"
          >
            <FaTimes className="w-4 h-4" />
            Cancel
          </button>
        </div>
      )}

      {successMsg && (
        <div className="glass-card p-4 text-center">
          <p className="text-accent-400 font-medium">{successMsg}</p>
        </div>
      )}

      {error && patient && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Discharge;
