// context/CreateTripContext.jsx
import React, { createContext, useState, useContext } from 'react';

const CreateTripContext = createContext(undefined);

export const CreateTripProvider = ({ children }) => {
  const [tripData, setTripData] = useState({});

  return (
    <CreateTripContext.Provider value={{ tripData, setTripData }}>
      {children}
    </CreateTripContext.Provider>
  );
};

export const useCreateTrip = () => {
  const context = useContext(CreateTripContext);
  if (!context) throw new Error('useCreateTrip must be used within a CreateTripProvider');
  return context;
};
