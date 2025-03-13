import React from 'react';
import axios from 'axios';

const GeneratePDF = ({ patientId }) => {
  const handleGeneratePDF = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/generate-pdf/${patientId}`, {
        responseType: 'blob',
      });

      // Create a link element for downloading the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `patient_${patientId}_report.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleGeneratePDF}
        className="w-full px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Generate Patient details
      </button>
    </div>
  );
};

export default GeneratePDF;
