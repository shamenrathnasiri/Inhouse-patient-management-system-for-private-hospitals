import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GeneratePDF from './GeneratePDF';

const DoctorForm = ({ getPatients, id, setGetPatients }) => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    diseases: '',
    treatment: '',
    discharge_date: '',
  });
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patients');
        setPatients(response.data);

        if (id) {
          const patient = response.data.find((p) => p.id === id);
          if (patient) {
            setPatientName(patient.name);
            setFormData({
              diseases: patient.diseases || '',
              treatment: patient.treatment || '',
              discharge_date: patient.discharge_date || '',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Fetch existing full patient data
      const res = await axios.get(`http://localhost:5000/patients/${id}`);
      const existingData = res.data;

      // 2. Create full payload with preserved data
      const payload = {
        name: existingData.name,
        age: existingData.age,
        dob: existingData.dob,
        admit_date: existingData.admit_date,
        symptoms: existingData.symptoms || [],
        conditions: existingData.conditions || [],
        diseases: formData.diseases,
        treatment: formData.treatment,
        discharge_date: formData.discharge_date,
      };

      // 3. Update full patient record
      await axios.put(`http://localhost:5000/update/${id}`, payload);

      alert('✅ Patient updated successfully by Doctor');
      setGetPatients(!getPatients);
    } catch (error) {
      console.error('Error updating patient:', error);
      alert('❌ Failed to update patient');
    }
  };

  return (
    <div className="max-w-lg p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-center text-gray-800">Doctor Update Form (ID: {id})</h2>

      {patientName && <h3 className="text-lg text-center text-gray-600">Patient: {patientName}</h3>}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block mb-1 font-medium">Diseases</label>
          <input
            type="text"
            value={formData.diseases}
            onChange={(e) => setFormData({ ...formData, diseases: e.target.value })}
            placeholder="e.g., Cold, Flu"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Treatment</label>
          <input
            type="text"
            value={formData.treatment}
            onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
            placeholder="e.g., Rest, Medication"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Discharge Date</label>
          <input
            type="date"
            value={formData.discharge_date}
            onChange={(e) => setFormData({ ...formData, discharge_date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Update Patient
        </button>
      </form>

      <div className="mt-6">
        <p className="text-center">Update before proceeding to generate PDF</p>
        <div className="mt-4">
          <GeneratePDF patientId={id} />
        </div>
      </div>
    </div>
  );
};

export default DoctorForm;
