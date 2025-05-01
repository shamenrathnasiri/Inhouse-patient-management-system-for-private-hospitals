import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NurseForm = ({ getPatients, setGetPatients, id }) => {
  const [patient, setPatient] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [newSymptom, setNewSymptom] = useState({ date: '', value: '' });
  const [newCondition, setNewCondition] = useState({ date: '', value: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchPatient();
    }
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/patients/${id}`);
      const data = response.data;
      setPatient(data);
      setSymptoms(data.symptoms || []);
      setConditions(data.conditions || []);
    } catch (error) {
      console.error('Error fetching patient:', error);
      setErrorMessage('Failed to load patient details.');
    }
  };

  const handleAddSymptom = () => {
    if (newSymptom.date && newSymptom.value) {
      const formattedSymptom = {
        description: newSymptom.value,
        date: newSymptom.date
      };
      setSymptoms([...symptoms, formattedSymptom]);
      setNewSymptom({ date: '', value: '' });
    }
  };

  const handleAddCondition = () => {
    if (newCondition.date && newCondition.value) {
      const formattedCondition = {
        description: newCondition.value,
        date: newCondition.date
      };
      setConditions([...conditions, formattedCondition]);
      setNewCondition({ date: '', value: '' });
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/update/${id}`, {
        symptoms,
        conditions,
      });
      setSuccessMessage('✅ Patient symptoms and conditions updated!');
      setErrorMessage('');
      setGetPatients(!getPatients); // Notify parent

      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setErrorMessage('❌ Update failed.');
      setSuccessMessage('');

      // Auto-dismiss error message after 3 seconds
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleCloseMessage = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  if (!id) {
    return <div className="flex justify-center p-6 text-gray-600">Please select a patient.</div>;
  }

  return (
    <div className="flex justify-center min-h-screen p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-2xl p-8 bg-white shadow-2xl rounded-xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-purple-700">Nurse Patient Update</h2>

        {/* Success and Error Messages */}
        {(successMessage || errorMessage) && (
          <div className={`mb-4 p-4 text-center rounded-md ${successMessage ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            <p>{successMessage || errorMessage}</p>
            <button
              onClick={handleCloseMessage}
              className="ml-4 text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        )}

        {patient ? (
          <>
            <h3 className="mb-4 text-xl font-semibold text-purple-700">
              👤 {patient.name} (ID: {patient.id})
            </h3>

            {/* Symptom Input */}
            <div className="mb-6">
              <h4 className="mb-2 font-semibold text-gray-700">Add Symptom</h4>
              <div className="flex gap-4 mb-2">
                <input
                  type="date"
                  value={newSymptom.date}
                  onChange={(e) => setNewSymptom({ ...newSymptom, date: e.target.value })}
                  className="w-1/3 px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Symptom"
                  value={newSymptom.value}
                  onChange={(e) => setNewSymptom({ ...newSymptom, value: e.target.value })}
                  className="w-2/3 px-3 py-2 border rounded-md"
                />
                <button onClick={handleAddSymptom} className="px-4 text-white bg-indigo-600 rounded-md">
                  Add
                </button>
              </div>

              <ul className="text-sm text-gray-700 list-disc list-inside">
                {symptoms.map((symptom, idx) => (
                  <li key={idx}>
                    📅 {symptom.date} - {symptom.description}
                  </li>
                ))}
              </ul>
            </div>

            {/* Condition Input */}
            <div className="mb-6">
              <h4 className="mb-2 font-semibold text-gray-700">Add Condition</h4>
              <div className="flex gap-4 mb-2">
                <input
                  type="date"
                  value={newCondition.date}
                  onChange={(e) => setNewCondition({ ...newCondition, date: e.target.value })}
                  className="w-1/3 px-3 py-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Condition"
                  value={newCondition.value}
                  onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
                  className="w-2/3 px-3 py-2 border rounded-md"
                />
                <button onClick={handleAddCondition} className="px-4 text-white bg-indigo-600 rounded-md">
                  Add
                </button>
              </div>

              <ul className="text-sm text-gray-700 list-disc list-inside">
                {conditions.map((condition, idx) => (
                  <li key={idx}>
                    📅 {condition.date} - {condition.description}
                  </li>
                ))}
              </ul>
            </div>

            {/* Update Button */}
            <div className="text-right">
              <button
                onClick={handleUpdate}
                className="px-6 py-2 mt-4 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                ✅ Update Patient
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Loading patient data...</p>
        )}
      </div>
    </div>
  );
};

export default NurseForm;
