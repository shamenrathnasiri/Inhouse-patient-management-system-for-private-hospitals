import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';

const PatientTreatmentView = () => {
  const { patientId ,setContent} = useAppContext();
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchTreatments = async () => {
      if (!patientId) {
        setErrorMsg('No patient ID found in context.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/view-treatments/${patientId}`);
        setTreatments(response.data.treatments);
      } catch (error) {
        if (error.response?.status === 404) {
          setErrorMsg('No treatments found for this patient.');
        } else {
          setErrorMsg('Failed to fetch treatments.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, [patientId]);

  return (
    <div className="max-w-4xl p-6 mx-auto bg-white rounded shadow">
      <h2 className="mb-4 text-2xl font-bold text-blue-600">Patient Treatment History</h2>

      {loading ? (
        <p>Loading treatments...</p>
      ) : errorMsg ? (
        <p className="text-red-500">{errorMsg}</p>
      ) : treatments.length > 0 ? (
        <table className="w-full mt-4 border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Symptom</th>
              <th className="p-2 border">Condition</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Prescription</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map((t) => (
              <tr key={t.id} className="text-center">
                <td className="p-2 border">{t.id}</td>
                <td className="p-2 border">{t.symptom}</td>
                <td className="p-2 border">{t.condition}</td>
                <td className="p-2 border">{t.date}</td>
                <td className="p-2 border">{t.prescription || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No treatments to display.</p>
      )}
      
      <button
       onClick={()=>setContent("viewpatients")}
       className="px-4 py-2 mt-6 text-white bg-green-600 rounded tex-6"
       
      >
        Back
      </button>
      <button
        onClick={async () => {
          try {
            const res = await axios.get(`http://localhost:5000/generate-treatment-pdf/${patientId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = `patient_${patientId}_treatments.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
          } catch (err) {
            console.error('Failed to download PDF', err);
          }
        }}
        className="px-4 py-2 mt-6 ml-4 text-white bg-blue-600 rounded"
      >
        Download PDF
      </button>
    </div>
  );
};

export default PatientTreatmentView;
