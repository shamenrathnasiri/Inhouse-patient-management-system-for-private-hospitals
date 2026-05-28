import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import SignaturePad from './SignaturePad';
import { FaUserMd, FaArrowLeft, FaCheckCircle, FaTimes, FaNotesMedical } from 'react-icons/fa';

const Discharge = () => {
  const { patientId, signature, setSigned, signed, setContent } = useAppContext();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discharging, setDischarging] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

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

  const handleDischarge = async () => {
    if (!signature) return;

    setDischarging(true);
    try {
      await axios.post(`http://localhost:5000/discharge/${patientId}`, {
        discharge_date: new Date().toISOString().slice(0, 10),
        doctor_signature: signature, // must be base64 image URL
      });

      setSuccessMsg("Patient discharged successfully.");
      setSigned(false);
      setTimeout(() => {
        setContent("generatepdf"); // go back to patient list or relevant screen
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

  if (error) return (
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

        {/* Signature input */}
        <div className="mt-8">
          <SignaturePad />
        </div>
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
    </div>
  );
};

export default Discharge;
