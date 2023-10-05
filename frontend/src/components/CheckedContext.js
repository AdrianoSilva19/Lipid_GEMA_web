import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Define your reducer function
const checkedReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CHECKED_STATE':
      return action.state;
    case 'TOGGLE_CHECKED':
      return {
        ...state,
        [action.lipidKey]: !state[action.lipidKey]
      };
    default:
      return state;
  }
};

const CheckedContext = createContext();

export const CheckedProvider = ({ children }) => {
  const [checkedState, dispatch] = useReducer(checkedReducer, {});

  useEffect(() => {
    const savedCheckedState = sessionStorage.getItem('checkedState');
    if (savedCheckedState) {
      dispatch({ type: 'LOAD_CHECKED_STATE', state: JSON.parse(savedCheckedState) });
    }
  }, []);
  
  // Save checked state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('checkedState', JSON.stringify(checkedState));
  }, [checkedState]);
  
  return (
    <CheckedContext.Provider value={{ checkedState, dispatch }}>
      {children}
    </CheckedContext.Provider>
  );
};

export const useChecked = () => {
  return useContext(CheckedContext);
};