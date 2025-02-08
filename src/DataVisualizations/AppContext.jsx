import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [inputData, setInputData] = useState([]);
  const [selectedChartType, setSelectedChartType] = useState('bar');

  const updateInputData = (data) => {
    setInputData(data);
  };

  const updateChartType = (chartType) => {
    setSelectedChartType(chartType);
  };

  return (
    <AppContext.Provider
      value={{
        inputData,
        selectedChartType,
        updateInputData,
        updateChartType
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
