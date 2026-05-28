import React, { useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import { FaExclamationTriangle, FaTrashAlt, FaTimes } from 'react-icons/fa';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="glass-card w-full max-w-sm p-6 mx-4 animate-fade-in">
        {/* Warning icon */}
        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20">
          <FaExclamationTriangle className="w-6 h-6 text-red-400" />
        </div>

        <h2 className="mb-2 text-lg font-bold text-white text-center">Are you sure?</h2>
        <p className="mb-6 text-sm text-dark-300 text-center">
          This action will permanently delete the patient and all associated treatments. This cannot be undone.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-accent-500/10 border border-accent-500/20">
            <p className="text-sm text-accent-400">{successMessage}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`btn-danger flex-1 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaTrashAlt className="w-3.5 h-3.5" />
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>

          <button
            onClick={() => setContent('patientcheck')}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <FaTimes className="w-3.5 h-3.5" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePatient;
