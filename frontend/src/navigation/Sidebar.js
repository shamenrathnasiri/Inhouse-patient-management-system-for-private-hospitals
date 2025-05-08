import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';


const Sidebar = () => {
  const { setContent, currentUser } = useAppContext();
  const navigate = useNavigate(); // hook for navigation

  const commonButtonClasses =
    'px-4 py-2 text-left rounded-lg transition-transform duration-300 hover:bg-sky-500 hover:text-white focus:outline-none  hover:scale-110';

  const formTitleClasses =
    'font-extrabold text-xl text-shadow-lg text-white text-center tracking-widest uppercase mb-4 drop-shadow';

  const handleLogout = () => {
    sessionStorage.removeItem('role');
    localStorage.removeItem('role');
    // Navigate to the /home page
    navigate('/');
  };

  return (
    <nav className="flex flex-col p-6 text-white shadow-2xl bg-gradient-to-r from-cyan-700 to-teal-700 rounded-2xl min-h-[550px] justify-between">
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
            <button onClick={() => setContent('chatbox')} className={commonButtonClasses}>
              Chat
            </button>
          </>
        )}

        {currentUser === 'doctor' && (
          <>
            <p className={formTitleClasses}>Doctor Form</p>
            <button onClick={() => setContent('patientcheck')} className={commonButtonClasses}>
              View Patients
            </button>
            <button onClick={() => setContent('chatbox')} className={commonButtonClasses}>
              Chat
            </button>
          </>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-2 mt-6 font-bold text-white transition-transform duration-300 bg-red-600 rounded-lg shadow-lg hover:bg-red-800 hover:scale-110"
      >
        Logout
      </button>
    </nav>
  );
};

export default Sidebar;
