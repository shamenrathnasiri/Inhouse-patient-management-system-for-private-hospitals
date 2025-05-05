import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import SignaturePad from './SignaturePad';

const Discharge = () => {
  const { patientId, signature, setSigned,signed,setContent } = useAppContext();
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

  const cancelbutton =()=>{
     setContent("patientcheck");
     setSigned(false);
  }

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!patient) return null;

  return (
    <div className="max-w-4xl p-6 mx-auto space-y-6 bg-white shadow-lg rounded-xl">
      <h2 className="pb-2 text-2xl font-bold text-blue-700 border-b">Patient Information</h2>

      {/* Patient Info */}
      <table className="w-full text-sm border table-auto">
        <tbody>
          <tr className="bg-gray-50">
            <td className="px-4 py-2 font-semibold border">Name</td>
            <td className="px-4 py-2 border">{patient.name}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-semibold border">Age</td>
            <td className="px-4 py-2 border">{patient.age}</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="px-4 py-2 font-semibold border">Date of Birth</td>
            <td className="px-4 py-2 border">{patient.dob}</td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-semibold border">Admit Date</td>
            <td className="px-4 py-2 border">{patient.admit_date}</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="px-4 py-2 font-semibold border">Discharge Date</td>
            <td className="px-4 py-2 border">{patient.discharge_date || 'Not yet discharged'}</td>
          </tr>
        </tbody>
      </table>

      {/* Treatments */}
      <div>
        <h3 className="mb-3 text-xl font-semibold text-blue-600">Treatment History</h3>
        {patient.treatments.length === 0 ? (
          <p className="text-gray-500">No treatments recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border table-auto">
              <thead className="text-blue-900 bg-blue-100">
                <tr>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Symptom</th>
                  <th className="px-4 py-2 border">Condition</th>
                  <th className="px-4 py-2 border">Prescription</th>
                </tr>
              </thead>
              <tbody>
                {patient.treatments.map((t, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 border">{t.date}</td>
                    <td className="px-4 py-2 border">{t.symptom}</td>
                    <td className="px-4 py-2 border">{t.condition}</td>
                    <td className="px-4 py-2 border">{t.prescription}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signature input */}
        <SignaturePad />
      </div>

      {/* Discharge Button */}
      {signed && (
        <div className="flex justify-end space-x-4">
            {signature}
          <button
            onClick={handleDischarge}
            className={`px-6 py-2 font-semibold text-white rounded ${
              discharging ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
            disabled={discharging}
          >
            {discharging ? 'Discharging...' : 'Discharge and Save'}
          </button>

          <button
            onClick={cancelbutton}
            className="px-6 py-2 font-semibold text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      )}

      {successMsg && <p className="mt-4 text-green-600">{successMsg}</p>}
    </div>
  );
};

export default Discharge;
