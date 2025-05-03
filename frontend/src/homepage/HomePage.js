import React ,{useEffect} from 'react';
import Sidebar from './Sidebar';
import Content from './Content';
import { useAppContext } from '../context/AppContext';


const HomePage = () => {
        const {setCurrentUser } = useAppContext();
    
    useEffect(() => {
        const savedRole = localStorage.getItem('role');
        if (savedRole) {
          setCurrentUser(savedRole);
        }
      }, [setCurrentUser]);
    
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex flex-col w-64 p-5 text-white bg-blue-900">
        <h2 className="mb-6 text-2xl font-bold">Hospital Management</h2>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <Content />
      </div>
    </div>
  );
};

export default HomePage;
