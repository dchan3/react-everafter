import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { shallowSearch } from '../utils/search';
import pages from '../utils/pages';

var initialState = ({
  items, useListElement, activeTabColor, truncate, maxPageTabs,
  maxPages, perPage, wrapper, enumerate, currentPage, currentColumn
}) => ({
  currentPage: currentPage || 1,
  currentColumn: currentColumn || 0,
  ascDesc: true,
  searchQuery: '',
  items,
  currentResults: items,
  previousResults: null,
  oldSearchQuery: null,
  maxPages: maxPages || null,
  perPage: perPage || 10,
  pages: pages(items, this.perPage, this.maxPages),
  thePage: this.pages[this.currentPage - 1],
  maxPageTabs: maxPageTabs || 5,
  truncate,
  activeTabColor,
  useListElement: useListElement || false,
  wrapper: wrapper || null,
  enumerate: enumerate || false,
  columns: []
});

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
    if (val.startsWith(newState.searchQuery)) {
      newState.currentResults =
        shallowSearch(newState.currentResults, val);
      newState.pages = pages(val, perPage, maxPages);
    }
    else if ((newState.searchQuery.startsWith(val) &&
        val.length + 1 === oldQ.length) || newState.oldSearchQuery === val) {
      newState.currentResults = newState.previousResults;
      newState.pages = pages(val, perPage, maxPages);
    }

    newState.oldSearchQuery = newState.searchQuery;
    newState.searchQuery = val;
    newState.previousResults = newState.currentResults;
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
      newState.oldSearchQuery = null;
      newState.searchQuery = '';
      newState.currentResults = newState.items;
      newState.previousResults = null;
      newState.pages = pages(val, perPage, maxPages);
      newState.currentPage = 1;
    }
  }
  newState.thePage = newState.pages[newState.currentPage - 1];
  return newState;
}

const { Provider } = PaginatorControlContext;

export const PaginatorControlProvider = ({ children, initialVals }) => {
  let iState = Object.assign({}, initialState);

  if (initialVals) {
    for (let k in initialVals) {
      iState[k] = initialVals[k];
    }
  }

  iState.pages = pages(iState.items, iState.perPage, iState.maxPages);
  iState.thePage = iState.pages[0];

  let [state, dispatch] = useReducer(reducer, iState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

PaginatorControlProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  initialVals: PropTypes.object
};

export default PaginatorControlContext;
