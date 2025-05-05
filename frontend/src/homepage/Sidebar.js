import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';


const Sidebar = () => {
  const { setContent, currentUser } = useAppContext();
  const navigate = useNavigate(); // hook for navigation

  const commonButtonClasses =
    'px-4 py-2 text-left rounded-lg transition-all duration-300 hover:bg-blue-500 hover:text-white focus:outline-none';

  const formTitleClasses =
    'font-extrabold text-xl text-shadow-lg text-white text-center tracking-widest uppercase mb-4 drop-shadow';

  const handleLogout = () => {
    // Remove role from localStorage
    localStorage.removeItem('role');
    
    // Navigate to the /home page
    navigate('/');
  };

  return (
    <nav className="flex flex-col p-6 text-white shadow-2xl bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl min-h-[550px] justify-between">
      <div className="flex flex-col gap-4">
        {currentUser === 'attendant' && (
          <>
            <p className={formTitleClasses}>Attendant Form</p>
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
            <p className={formTitleClasses}>Head of Nurse Form</p>
            <button onClick={() => setContent('viewpatients')} className={commonButtonClasses}>
              View Patients
            </button>
          </>
        )}

        {currentUser === 'doctor' && (
          <>
            <p className={formTitleClasses}>Doctor Form</p>
            <button onClick={() => setContent('patientcheck')} className={commonButtonClasses}>
              View Patients
            </button>
            <button onClick={() => setContent('generatepdf')} className={commonButtonClasses}>
              Chat
            </button>
          </>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-2 mt-6 text-white transition-all duration-300 bg-red-300 rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
};

export default Sidebar;
