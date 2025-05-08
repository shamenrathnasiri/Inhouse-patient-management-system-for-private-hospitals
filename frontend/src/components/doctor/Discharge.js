import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import SignaturePad from './SignaturePad';

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

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!patient) return null;

  return (
    <div className="max-w-4xl p-8 mx-auto space-y-6 shadow-xl bg-gradient-to-r from-blue-50 to-white rounded-xl">
      <h2 className="text-3xl font-bold text-center text-blue-800">Patient Discharge Details</h2>

      {/* Patient Info */}
      <table className="w-full text-sm bg-white border border-gray-300 shadow-sm rounded-xl">
        <tbody>
          <tr className="bg-gray-100">
            <td className="px-6 py-3 font-semibold text-gray-600">Name</td>
            <td className="px-6 py-3 text-gray-800">{patient.name}</td>
          </tr>
          <tr className="border-t">
            <td className="px-6 py-3 font-semibold text-gray-600">Age</td>
            <td className="px-6 py-3 text-gray-800">{patient.age}</td>
          </tr>
          <tr className="bg-gray-100">
            <td className="px-6 py-3 font-semibold text-gray-600">Date of Birth</td>
            <td className="px-6 py-3 text-gray-800">{patient.dob}</td>
          </tr>
          <tr className="border-t">
            <td className="px-6 py-3 font-semibold text-gray-600">Admit Date</td>
            <td className="px-6 py-3 text-gray-800">{patient.admit_date}</td>
          </tr>
          <tr className="bg-gray-100">
            <td className="px-6 py-3 font-semibold text-gray-600">Discharge Date</td>
            <td className="px-6 py-3 text-gray-800">{patient.discharge_date || 'Not yet discharged'}</td>
          </tr>
        </tbody>
      </table>

      {/* Treatments */}
      <div>
        <h3 className="mb-4 text-2xl font-bold text-blue-600">Treatment History</h3>
        {patient.treatments.length === 0 ? (
          <p className="text-gray-500">No treatments recorded.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="w-full text-sm text-gray-600 table-auto">
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
        <div className={'mt-8'}>
        <SignaturePad /> </div>
      </div>

      {/* Discharge Button */}
      {signed && (
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={handleDischarge}
            className={`px-6 py-2 text-lg font-semibold text-white rounded-lg shadow-md transition duration-300 ease-in-out transform ${
              discharging ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:scale-105'
            }`}
            disabled={discharging}
          >
            {discharging ? 'Discharging...' : 'Discharge & Save'}
          </button>

          <button
            onClick={cancelbutton}
            className="px-6 py-2 text-lg font-semibold text-gray-700 transition duration-300 ease-in-out bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 hover:scale-105"
          >
            Cancel
          </button>
        </div>
      )}

      {successMsg && <p className="mt-4 text-center text-green-600">{successMsg}</p>}
    </div>
  );
};

export default Discharge;
