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

  // Load checked state from localStorage on initial load
  useEffect(() => {
    const savedCheckedState = localStorage.getItem('checkedState');
    if (savedCheckedState) {
      dispatch({ type: 'LOAD_CHECKED_STATE', state: JSON.parse(savedCheckedState) });
    }
  }, []);

  // Save checked state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('checkedState', JSON.stringify(checkedState));
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