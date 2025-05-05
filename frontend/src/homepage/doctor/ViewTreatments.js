import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';

const ViewTreatments = () => {
  const { patientId , setContent} = useAppContext();
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
    <div className="p-4 bg-white rounded shadow">
      <h2 className="mb-4 text-2xl font-bold text-blue-600">Patient Treatment History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : errorMsg ? (
        <p className="text-red-500">{errorMsg}</p>
      ) : (
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Symptom</th>
              <th className="p-2 border">Condition</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Prescription</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((treatment) => (
              <tr key={treatment.id} className="text-center">
                <td className="p-2 border">{treatment.id}</td>
                <td className="p-2 border">{treatment.symptom}</td>
                <td className="p-2 border">{treatment.condition}</td>
                <td className="p-2 border">{treatment.date}</td>
                <td className="p-2 border">
                  {treatment.prescription || 'N/A'}
                </td>
                <td className="p-2 border">
                  {!treatment.prescription ? (
                    editingId === treatment.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={prescriptionInput}
                          onChange={(e) => setPrescriptionInput(e.target.value)}
                          className="w-full p-1 border rounded"
                          placeholder="Enter prescription"
                        />
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleSubmitPrescription(treatment.id)}
                            className="px-2 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setPrescriptionInput('');
                            }}
                            className="px-2 py-1 text-white bg-gray-500 rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingId(treatment.id)}
                        className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                      >
                        Add Prescription
                      </button>
                    )
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex flex-col gap-4 mt-6 sm:flex-row">
  <button
    onClick={() => setContent("discharge")}
    className="px-4 py-2 font-semibold text-white transition duration-300 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
  >
    Discharge and Generate Medical Report
  </button>

  <button
    onClick={() => setContent("patientcheck")}
    className="px-4 py-2 font-semibold text-gray-800 transition duration-300 bg-gray-300 rounded-lg shadow-md hover:bg-gray-400"
  >
    Back
  </button>
</div>

      
    </div>

    
    
  );
};

export default ViewTreatments;
