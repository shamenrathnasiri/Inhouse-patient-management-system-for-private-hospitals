import React, { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';

const DeletePatient = () => {
    const { patientId, setContent} = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleDelete = async () => {
    if (!patientId) {
      setError('No patient selected');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.delete(`http://localhost:5000/patient/delete/${patientId}`);
      if (response.status === 200) {
        setContent('patientcheck');
      }
    } catch (err) {
      setError('There was an error deleting the patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Are you sure?</h2>
        <p className="mb-4">This action will permanently delete the patient and all associated treatments.</p>

        {error && <p className="mb-4 text-red-500">{error}</p>}
        {successMessage && <p className="mb-4 text-green-500">{successMessage}</p>}

        <div className="flex justify-between">
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`px-4 py-2 bg-red-500 text-white rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>

          <button
            onClick={() => setContent('patientcheck')}
            className="px-4 py-2 text-black bg-gray-300 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePatient;
