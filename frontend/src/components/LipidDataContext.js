import React, { createContext, useContext, useState } from 'react';

const LipidDataContext = createContext();

export const LipidDataProvider = ({ children }) => {
  const [lipidData, setLipidData] = useState({}); // Initialize with an empty object

  return (
    <LipidDataContext.Provider value={{ lipidData, setLipidData }}>
      {children}
    </LipidDataContext.Provider>
  );
};

export const useLipidData = () => {
  return useContext(LipidDataContext);
};