import React, { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { FaNotesMedical, FaArrowLeft, FaPlusCircle } from 'react-icons/fa';

const UpdateTreatments = () => {
  const { patientId, setContent } = useAppContext();

  const [symptom, setSymptom] = useState('');
  const [condition, setCondition] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddTreatment = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post(
        `http://localhost:5000/patients/add-treatment-no-prescription`,
        {
          patient_id: patientId,
          symptom,
          condition,
          date
        }
      );
      setSuccessMessage(response.data.message);
      setSymptom('');
      setCondition('');
      setDate('');
      setContent("viewpatients")
    } catch (error) {
      setErrorMessage('Failed to add treatment without prescription.');
      console.error('Error adding treatment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20">
            <FaNotesMedical className="w-5 h-5 text-accent-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Add Treatment</h2>
            <p className="text-sm text-dark-400">Record patient condition without prescription</p>
          </div>
        </div>

        <button
          onClick={() => setContent('viewpatients')}
          className="btn-secondary flex items-center gap-2"
          aria-label="Back to All Patient Details"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
          Back to All Patients
        </button>
      </div>

      {/* Form */}
      <div className="glass-card p-6 max-w-2xl">
        <div className="space-y-5">
          <div>
            <label className="form-label">Symptom</label>
            <input
              type="text"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              className="input-field"
              placeholder="Enter symptom"
            />
          </div>

          <div>
            <label className="form-label">Condition</label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="input-field"
              placeholder="Enter condition"
            />
          </div>

          <div>
            <label className="form-label">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
            />
          </div>

          <button
            onClick={handleAddTreatment}
            className={`btn-accent flex items-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            <FaPlusCircle className="w-4 h-4" />
            {loading ? 'Adding...' : 'Add Treatment'}
          </button>

          {successMessage && (
            <div className="p-3 rounded-xl bg-accent-500/10 border border-accent-500/20">
              <p className="text-sm text-accent-400">{successMessage}</p>
            </div>
          )}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateTreatments;
