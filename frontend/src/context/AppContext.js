import React, { useEffect, createContext, useContext, useState } from 'react';

// Create context
const AppContext = createContext();

// Custom hook for convenience
export const useAppContext = () => useContext(AppContext);

// Context Provider
export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem("role"));
  const [patientId, setPatientId] = useState();
  const [signature, setSignature] = useState(null);
  const [content, setContent] = useState(null); // initially set to null
  const [signed, setSigned] = useState(false);

  // Set the content based on the currentUser value when it changes
  useEffect(() => {
    if (currentUser) {
      // Set the content based on the user role
      if (currentUser === 'doctor') {
        setContent('patientcheck');
      } else if (currentUser === 'nurse') {
        setContent('viewpatients');
      } else if (currentUser === 'attendant') {
        setContent('addpatient');
      } else {
        setContent(''); // Fallback to empty if no valid role
      }
    }
  }, [currentUser]); // dependency on currentUser, so it runs every time currentUser changes

  return (
    <AppContext.Provider value={{ 
        content, setContent,
        currentUser, setCurrentUser,
        patientId, setPatientId,
        signature, setSignature,
        signed, setSigned
    }}>
      {children}
    </AppContext.Provider>
  );
};
