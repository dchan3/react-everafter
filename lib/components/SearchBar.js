import React, { useContext } from 'react';
import PaginatorControlContext from './PaginatorControlContext';

export default function PaginatorSearchBar() {
  const { state, dispatch } = useContext(PaginatorControlContext);

  function handleSearchChange(event) {
    dispatch({ query: event.target.value });
  }

  return <input type="text" placeholder="Search"
    value={state.searchQuery} onChange={handleSearchChange}/>
}
