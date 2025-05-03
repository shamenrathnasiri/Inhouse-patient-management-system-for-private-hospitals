import React, { createContext, useContext, useState } from 'react';

// Create context
const AppContext = createContext();

// Custom hook for convenience
export const useAppContext = () => useContext(AppContext);


// Context Provider
export const AppProvider = ({ children }) => {
const [content, setContent] = useState("dashboard");
 const [currentUser, setCurrentUser] = useState("");
 const [patientId, setPatientId] = useState();

  return (
    <AppContext.Provider value={{ 
        content, setContent,
        currentUser, setCurrentUser,
        patientId, setPatientId
    
        }}>
      {children}
    </AppContext.Provider>
  );
};
