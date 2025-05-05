import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Content from './Content';
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
    <div className="flex h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-white">
      {/* Sidebar */}
      <div className="p-6 text-white shadow-2xl w-72 bg-gradient-to-b from-blue-800 to-indigo-900 rounded-r-3xl">
        <h2 className="mb-8 text-3xl font-extrabold tracking-wide text-center text-white-200 drop-shadow">
          Hospital System
        </h2>
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
