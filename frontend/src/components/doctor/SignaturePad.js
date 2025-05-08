import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useAppContext } from '../../context/AppContext';


const SignaturePad = () => {
  const { setSignature, setSigned} = useAppContext();
  const sigRef = useRef(null);

  const handleClear = () => {
    sigRef.current.clear();
    setSignature(null); 
    setSigned(false);
  };

  const handleSave = () => {
    if (!sigRef.current.isEmpty()) {
      const dataURL = sigRef.current.toDataURL('image/png');
      setSignature(dataURL); 
      setSigned(true);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-white border shadow-md rounded-xl">
      <h2 className="text-lg font-semibold">Doctor Signature</h2>
      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{ width: 400, height: 150, className: "border rounded-md" }}
      />
      <div className="flex space-x-4">
        <button onClick={handleSave} className="px-4 py-1 text-white transition-transform duration-200 bg-green-600 rounded shadow-md hover:scale-110">Save</button>
        <button onClick={handleClear} className="px-4 py-1 text-white transition-transform duration-200 bg-red-600 rounded shadow-md hover:scale-110">Clear</button>
      </div>

      
    </div>
  );
};
export default SignaturePad;