import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const initialState = {
  currentPage: 1,
  currentColumn: 0,
  ascDesc: true,
  searchQuery: ''
};

const PaginatorControlContext = createContext(initialState);

function reducer(state, { type, val }) {
  let newState = Object.assign({}, state);
  if (type === 'page') {
    if (val === '-') newState.currentPage--;
    else if (val === '+') newState.currentPage++;
    else newState.currentPage = val;
  }
  else if (type === 'column') newState.currentColumn = val;
  else if (type === 'toggle') newState.ascDesc = !newState.ascDesc;
  else if (type === 'query') newsSate.searchQuery = val;
  return newState;
}

const { Provider } = PaginatorControlContext;

export const PaginatorControlProvider = ({ children }) => {
  let [state, dispatch] = useReducer(reducer, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

PaginatorControlProvider.propTypes = {
  children: PropTypes.array
};

export default PaginatorControlContext;
