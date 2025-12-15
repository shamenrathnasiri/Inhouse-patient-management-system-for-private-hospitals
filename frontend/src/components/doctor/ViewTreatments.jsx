import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';

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
    <div className="p-6 mx-auto bg-white shadow-lg rounded-xl max-w-7xl">
      <h2 className="mb-6 text-3xl font-extrabold text-center text-blue-700">
        🩺 Patient Treatment History
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : errorMsg ? (
        <p className="text-center text-red-500">{errorMsg}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-300 rounded-lg shadow-sm">
            <thead className="text-white bg-blue-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Symptom</th>
                <th className="px-4 py-3">Condition</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Prescription</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {treatments.map((treatment, index) => (
                <tr key={treatment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{treatment.id}</td>
                  <td className="px-4 py-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                      {treatment.symptom}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
                      {treatment.condition}
                    </span>
                  </td>
                  <td className="px-4 py-2">{treatment.date}</td>
                  <td className="px-4 py-2 text-sm">
                    {treatment.prescription ? (
                      <span className="inline-block px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-lg">
                        {treatment.prescription}
                      </span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {!treatment.prescription ? (
                      editingId === treatment.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={prescriptionInput}
                            onChange={(e) => setPrescriptionInput(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter prescription"
                          />
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleSubmitPrescription(treatment.id)}
                              className="px-3 py-1 text-sm text-white transition bg-green-600 rounded-md hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setPrescriptionInput('');
                              }}
                              className="px-3 py-1 text-sm text-white transition bg-gray-500 rounded-md hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingId(treatment.id)}
                          className="px-3 py-1 text-sm text-white transition bg-blue-500 rounded-md hover:bg-blue-600"
                        >
                          Add Prescription
                        </button>
                      )
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-col gap-4 mt-8 sm:flex-row sm:justify-center">
        <button
          onClick={() => setContent("discharge")}
          className="w-full px-6 py-3 font-semibold text-white transition bg-blue-700 rounded-lg sm:w-auto hover:bg-blue-800"
        >
           Discharge and Generate Medical Report
        </button>

        <button
          onClick={() => setContent("patientcheck")}
          className="w-full px-6 py-3 font-semibold text-gray-800 transition bg-gray-200 rounded-lg shadow-md sm:w-auto hover:bg-gray-300"
        >
           Back
        </button>
      </div>
    </div>
  );
};

export default ViewTreatments;
