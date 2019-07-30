import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { shallowSearch } from '../utils/search';
import pages from '../utils/pages';

var initialState = ({
  items, useListElement, activeTabColor, truncate, maxPageTabs,
  maxPages, perPage, wrapper, enumerate, currentPage, currentColumn
}) => {
  let themPages = pages(items, perPage || 10, maxPages || null);
  return {
    currentPage: currentPage || 1,
    currentColumn: currentColumn || 0,
    ascDesc: true,
    searchQuery: '',
    items,
    currentResults: items,
    maxPages: maxPages || null,
    perPage: perPage || 10,
    pages: themPages,
    thePage: themPages.length ? themPages[(currentPage || 1) - 1] : [],
    maxPageTabs: maxPageTabs || 5,
    truncate,
    activeTabColor: activeTabColor || '#5940be',
    useListElement: useListElement || false,
    wrapper: wrapper || null,
    enumerate: enumerate || false,
    columns: []
  }
};

const PaginatorControlContext = createContext(initialState);

function reducer(state, { type, val }) {
  let newState = Object.assign({}, state);
  if (type === 'page') {
    if (val === '-') newState.currentPage--;
    else if (val === '+') newState.currentPage++;
    else newState.currentPage = val;
  }
  else if (type === 'column') {
    newState.currentColumn = val;
    newState.ascDesc = true;
    newState.pages.sort((a, b) => {
      let dispA = columns[newState.currentColumn].display(a),
        dispB = columns[newState.currentColumn].display(b);
      return (dispA.props ? renderToString(dispA) : dispA.toString())
        .localeCompare((dispB.props ? renderToString(dispB) : dispB.toString())
        ) * (newState.ascDesc ? 1 : -1)
    });
  }
  else if (type === 'toggle') {
    newState.ascDesc = !newState.ascDesc;
    newState.pages.sort((a, b) => {
      let dispA = columns[newState.currentColumn].display(a),
        dispB = columns[newState.currentColumn].display(b);
      return (dispA.props ? renderToString(dispA) : dispA.toString())
        .localeCompare((dispB.props ? renderToString(dispB) : dispB.toString())
        ) * (newState.ascDesc ? 1 : -1)
    });
  }
  else if (type === 'query') {
    if (val.startsWith(newState.searchQuery) && newState.searchQuery.length) {
      let results = shallowSearch(newState.currentResults, val);
      if (results.length < newState.currentResults.length) {
        newState.currentResults = results;
      }
    }
    else {
      newState.currentResults = shallowSearch(newState.items, val);
    }

    newState.pages = pages(newState.currentResults, newState.perPage,
      newState.maxPages);
    newState.searchQuery = val;
    newState.currentPage = 1;
  }
  else if (type === 'items') {
    newState.items = val;
    newState.currentResults = val;
    newState.pages = pages(val, perPage, maxPages);
    newState.currentPage = 1;
  }
  else if (type === 'objectInit') {
    for (let p in val) {
      newState[p] = val[p];
    }
  }
  else {
    newState[type] = val;
    if (type === 'perPage' || type === 'maxPages') {
      newState.searchQuery = '';
      newState.currentResults = newState.items;
      newState.pages = pages(val, perPage, maxPages);
      newState.currentPage = 1;
    }
  }
  if (newState.pages.length) {
    if (newState.currentPage > newState.pages.length) newState.currentPage = 1;
    newState.thePage = newState.pages[newState.currentPage - 1];
  }
  else newState.thePage = [];
  return newState;
}

const { Provider } = PaginatorControlContext;

export const PaginatorControlProvider = ({ children, initialVals }) => {
  let iState = Object.assign({}, initialState(initialVals));

  if (initialVals) {
    for (let k in initialVals) {
      iState[k] = initialVals[k];
    }
  }

  iState.pages = pages(iState.items, iState.perPage, iState.maxPages);
  if (iState.pages.length) iState.thePage = iState.pages[0];

  let [state, dispatch] = useReducer(reducer, iState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

PaginatorControlProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  initialVals: PropTypes.object
};

export default PaginatorControlContext;
