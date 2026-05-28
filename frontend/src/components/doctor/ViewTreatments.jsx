import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { FaStethoscope, FaArrowLeft, FaFileAlt, FaSave, FaTimes, FaPrescriptionBottleAlt } from 'react-icons/fa';

const ViewTreatments = () => {
  const { patientId, setContent } = useAppContext();
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [prescriptionInput, setPrescriptionInput] = useState('');

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/view-treatments/${patientId}`);
        setTreatments(res.data.treatments);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setErrorMsg('No treatments found for this patient.');
        } else {
          setErrorMsg('Failed to fetch treatments.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchTreatments();
    }
  }, [patientId]);

  const handleSubmitPrescription = async (treatmentId) => {
    try {
      await axios.put(`http://localhost:5000/add-prescription/${treatmentId}`, {
        prescription: prescriptionInput,
      });
      setTreatments((prev) =>
        prev.map((t) =>
          t.id === treatmentId ? { ...t, prescription: prescriptionInput } : t
        )
      );
      setEditingId(null);
      setPrescriptionInput('');
    } catch {
      alert('Failed to add prescription');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20">
            <FaStethoscope className="w-5 h-5 text-accent-400" />
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
          <FaStethoscope className="w-12 h-12 mx-auto mb-4 text-dark-700" />
          <p className="text-red-400">{errorMsg}</p>
        </div>
      ) : (
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
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {treatments.map((treatment, index) => (
                  <tr key={treatment.id} className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                    <td className="font-medium text-white">{treatment.id}</td>
                    <td>
                      <span className="badge badge-info">
                        {treatment.symptom}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-purple">
                        {treatment.condition}
                      </span>
                    </td>
                    <td>{treatment.date}</td>
                    <td>
                      {treatment.prescription ? (
                        <span className="badge badge-success">
                          {treatment.prescription}
                        </span>
                      ) : (
                        <span className="text-dark-500">N/A</span>
                      )}
                    </td>
                    <td className="text-center">
                      {!treatment.prescription ? (
                        editingId === treatment.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows={2}
                              value={prescriptionInput}
                              onChange={(e) => setPrescriptionInput(e.target.value)}
                              className="input-field text-sm"
                              placeholder="Enter prescription"
                            />
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleSubmitPrescription(treatment.id)}
                                className="btn-accent flex items-center gap-1.5 px-3 py-1.5 text-xs"
                              >
                                <FaSave className="w-3 h-3" />
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setPrescriptionInput('');
                                }}
                                className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs"
                              >
                                <FaTimes className="w-3 h-3" />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingId(treatment.id)}
                            className="btn-primary flex items-center gap-1.5 px-3 py-1.5 text-xs mx-auto"
                          >
                            <FaPrescriptionBottleAlt className="w-3 h-3" />
                            Add Prescription
                          </button>
                        )
                      ) : (
                        <span className="text-dark-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex flex-col gap-3 mt-8 sm:flex-row sm:justify-center">
        <button
          onClick={() => setContent("discharge")}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <FaFileAlt className="w-4 h-4" />
          Discharge and Generate Medical Report
        </button>

        <button
          onClick={() => setContent("patientcheck")}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewTreatments;
