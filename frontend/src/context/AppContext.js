import React, { useEffect, createContext, useContext, useState } from 'react';
import axios from 'axios';
// Create context
const AppContext = createContext();

// Custom hook for convenience
export const useAppContext = () => useContext(AppContext);

// Context Provider
export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => sessionStorage.getItem("role"));
  const [patientId, setPatientId] = useState();
  const [signature, setSignature] = useState(null);
  const [content, setContent] = useState(null); // initially set to null
  const [signed, setSigned] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

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

  // Poll unread message count for doctor and nurse
  useEffect(() => {
    if (!currentUser || (currentUser !== 'doctor' && currentUser !== 'nurse')) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/chat/unread-count?user=${currentUser}`);
        setUnreadCount(response.data.unread_count);
      } catch (err) {
        console.error('Error fetching unread count:', err);
      }
    };

    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 3000);
    return () => clearInterval(intervalId);
  }, [currentUser]);

  // Mark messages as read
  const markMessagesAsRead = async () => {
    if (!currentUser) return;
    try {
      await axios.post('http://localhost:5000/chat/mark-read', { user: currentUser });
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patients/all-details');
        setPatients(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch patient data.');
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients(); // initial fetch
    const intervalId = setInterval(fetchPatients, 3000); // fetch every 3 seconds

    return () => clearInterval(intervalId); // cleanup
  }, []);


  return (
    <AppContext.Provider value={{ 
        content, setContent,
        currentUser, setCurrentUser,
        patientId, setPatientId,
        signature, setSignature,
        signed, setSigned,
        patients, loading, error,
        unreadCount, markMessagesAsRead
    }}>
      {children}
    </AppContext.Provider>
  );
};
