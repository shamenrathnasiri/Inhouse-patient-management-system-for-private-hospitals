import React, { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';

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
    <div className="add-treatment-container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Add Treatment (No Prescription)</h2>
        <button
          onClick={() => setContent('viewpatients')}
          className="px-3 py-1 text-sm font-medium text-white bg-gray-600 rounded hover:bg-gray-700"
          aria-label="Back to All Patient Details"
        >
          ← Back to All Patient Details
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold">Symptom</label>
        <input
          type="text"
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          className="w-full p-2 mt-1 border rounded"
          placeholder="Enter symptom"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold">Condition</label>
        <input
          type="text"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full p-2 mt-1 border rounded"
          placeholder="Enter condition"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 mt-1 border rounded"
        />
      </div>

      <button
        onClick={handleAddTreatment}
        className="px-4 py-2 text-white bg-green-600 rounded"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Treatment'}
      </button>

      {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
      {errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}
    </div>
  );
};

export default UpdateTreatments;
