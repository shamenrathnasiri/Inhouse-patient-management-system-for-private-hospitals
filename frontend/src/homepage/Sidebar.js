import React from 'react';
import { useAppContext } from '../context/AppContext';

const Sidebar = () => {
  const { setContent, currentUser } = useAppContext();

  const commonButtonClasses =
    'px-4 py-2 text-left rounded-lg transition-all duration-300 hover:bg-blue-500 hover:text-white focus:outline-none';

  const formTitleClasses =
    'font-extrabold text-xl text-shadow-lg text-white text-center tracking-widest uppercase mb-4 drop-shadow';

  return (
    <nav className="flex flex-col gap-4 p-6 text-white shadow-2xl bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
      {currentUser === 'attendant' && (
        <>
          <p className={formTitleClasses}>Attendant Form</p>
          <button
            onClick={() => setContent('addpatient')}
            className={`${commonButtonClasses} mb-2`}
          >
            Add Patient
          </button>
          <button
            onClick={() => setContent('allpatients')}
            className={commonButtonClasses}
          >
            View Patients
          </button>
        </>
      )}

      {currentUser === 'nurse' && (
        <>
          <p className={formTitleClasses}>Head of Nurse Form</p>
          <button
            onClick={() => setContent('viewpatients')}
            className={commonButtonClasses}
          >
            View Patients
          </button>
        </>
      )}

      {currentUser === 'doctor' && (
        <>
          <p className={formTitleClasses}>Doctor Form</p>
          <button
            onClick={() => setContent('patientcheck')}
            className={commonButtonClasses}
          >
            View Patients
          </button>
        </>
      )}
    </nav>
  );
};

export default Sidebar;
