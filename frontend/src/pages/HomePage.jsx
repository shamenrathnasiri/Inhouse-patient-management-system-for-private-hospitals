import React, { useEffect } from 'react';
import Sidebar from '../navigation/Sidebar';
import Content from '../navigation/Content';
import { useAppContext } from '../context/AppContext';

const HomePage = () => {
  const { setCurrentUser} = useAppContext();

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    if (savedRole) {
      setCurrentUser(savedRole);
    }
  }, [setCurrentUser]);

 

  return (
    <div className="flex h-screen bg-gradient-to-br from-Teal-100 via-emerald-100 to-emerald">
      {/* Sidebar */}
      <div className="h-full p-6 text-white shadow-2xl w-72 bg-gradient-to-b from-teal-600 to-emerald-600 rounded-r-3xl">
        <h2 className="mb-8 text-3xl font-extrabold tracking-wide text-center text-white-200 drop-shadow">
          Hospital Management System
        </h2>
        <div className='mt-4'>
{/* hospital name */}
        <p className="mb-4 text-white text-centbold font-semitracking-wide drop-shadow">
          City general hospital
        </p>
        </div>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Content />
      </div>
    </div>
  );
};

export default HomePage;
