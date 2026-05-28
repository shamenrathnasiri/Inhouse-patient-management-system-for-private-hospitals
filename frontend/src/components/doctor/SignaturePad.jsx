import React, { useRef,  } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { useAppContext } from '../../context/AppContext';
import { FaPen, FaSave, FaEraser } from 'react-icons/fa';

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
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <FaPen className="w-4 h-4 text-primary-400" />
        <h2 className="text-lg font-semibold text-white">Doctor Signature</h2>
      </div>
      <div className="rounded-xl overflow-hidden border border-dark-700/50" style={{ background: 'rgba(10, 10, 20, 0.6)' }}>
        <SignatureCanvas
          ref={sigRef}
          penColor="white"
          canvasProps={{ width: 400, height: 150, className: "w-full" }}
        />
      </div>
      <div className="flex gap-3">
        <button onClick={handleSave} className="btn-accent flex items-center gap-2 text-sm">
          <FaSave className="w-3.5 h-3.5" />
          Save Signature
        </button>
        <button onClick={handleClear} className="btn-danger flex items-center gap-2 text-sm">
          <FaEraser className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>
    </div>
  );
};
export default SignaturePad;