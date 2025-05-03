import React from 'react';
import { useAppContext } from '../context/AppContext';

const Sidebar = () => {
  const { setContent, currentUser } = useAppContext();

  const commonButtonClasses =
    'px-4 py-2 text-left rounded transition hover:bg-blue-500';

  return (
    <nav className="flex flex-col gap-4 p-4">
      {currentUser === 'attendant' && (
        <>
          <button onClick={() => setContent('addpatient')} className={commonButtonClasses}>
            Add Patient
          </button>
          <button onClick={() => setContent('allpatients')} className={commonButtonClasses}>
            View Patients
          </button>
        </>
      )}

      {currentUser === 'nurse' && (
        <>
          <button onClick={() => setContent('viewpatients')} className={commonButtonClasses}>
            View Patients
          </button>
        </>
      )}

      {currentUser === 'doctor' && (
        <>
          <button onClick={() => setContent('patientcheck')} className={commonButtonClasses}>
            View Patients
          </button>
        </>
      )}
    </nav>
  );
};

export default Sidebar;
