import React, { useEffect } from 'react';
import Sidebar from '../navigation/Sidebar';
import Content from '../navigation/Content';
import { useAppContext } from '../context/AppContext';

const HomePage = () => {
  const { setCurrentUser } = useAppContext();

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    if (savedRole) {
      setCurrentUser(savedRole);
    }
  }, [setCurrentUser]);

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent-500/4 rounded-full blur-[80px]" />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 flex flex-col w-72 h-full shrink-0 border-r border-dark-800/50 bg-dark-950/80 backdrop-blur-xl">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-dark-800/50">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20">
              <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">HMS Portal</h2>
              <p className="text-xs text-dark-500">City General Hospital</p>
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <Sidebar />
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
          <Content />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
