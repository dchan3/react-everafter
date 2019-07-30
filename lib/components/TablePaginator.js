import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import PaginatorControls from './PaginatorControls';
import PaginatorControlContext, {
  PaginatorControlProvider } from './PaginatorControlContext';
import pages from '../utils/pages';
import styled from 'styled-components';

let TableHeaderCell = styled.td`
  &:hover {
    background-color: grey;
  }
`;

function TablePaginatorSearchBar() {
  let { state: { searchQuery }, dispatch } =
    useContext(PaginatorControlContext);

  function handleSearchChange(event) {
    dispatch({ type: 'query', val: event.target.value });
  }

  return <input type="text" placeholder="Search" value={searchQuery}
    onChange={handleSearchChange}/>
}

function TablePaginatorDisplay() {
  let { state, dispatch } = useContext(PaginatorControlContext);
  let {
    enumerate, thePage, columns, maxPages, perPage, className, id, ascDesc,
    currentColumn } = state;

  function handleHeaderClick(i) {
    if (currentColumn === i) {
      return dispatch({ type: 'toggle' });
    }
    else return dispatch({ type: 'column', val: i });
  }

  function renderHeader() {
    return <thead><tr>
      {enumerate ? <td><b>{'#'}</b></td> : null}
      {columns.map(({ headerText }, i) => <TableHeaderCell
        onClick={() => handleHeaderClick(i)}>
        <b>{headerText}</b>
        {' '}
        {currentColumn === i ? <span>{ascDesc ? '▲' : '▼'}</span> : null}
      </TableHeaderCell>)}
    </tr></thead>;
  }

  function renderPage() {
    return <tbody>
      {thePage.map((item, i) => <tr key={i}>
        {enumerate ? <td>{i}</td> : null}
        {columns.map(({ display }, j) => <td key={j}>{display(item)}</td>)}
      </tr>)}
    </tbody>;
  }

  return <table key='table-paginator' {...{ className, id }}>
    {renderHeader()}
    {renderPage()}
  </table>;
}

function TablePaginatorDiv() {
  return <div>
    <TablePaginatorDisplay />
    <PaginatorControls />
  </div>;
}

function TablePaginatorTop({
  activeTabColor, truncate, maxPageTabs, maxPages, enumerate, className, id,
  columns, items, perPage
}) {
  return <div>
    <TablePaginatorSearchBar />
    <TablePaginatorDiv />
  </div>
};

TablePaginatorTop.propTypes = {
  items: PropTypes.array,
  columns: PropTypes.arrayOf(PropTypes.shape({
    headerText: PropTypes.string,
    display: PropTypes.func
  })),
  enumerate: PropTypes.bool,
  perPage: PropTypes.number,
  activeTabColor: PropTypes.string,
  truncate: PropTypes.bool,
  maxPageTabs: PropTypes.number,
  maxPages: PropTypes.number,
  className: PropTypes.string,
  id: PropTypes.string
};

TablePaginatorTop.defaultProps = {
  activeTabColor: '#5940be',
  truncate: false,
  maxPageTabs: 5,
  maxPages: null,
  enumerate: false,
  className: null,
  id: null
};

export default function TablePaginator(props) {
  return <PaginatorControlProvider initialVals={{ ...props }}>
    <TablePaginatorTop />
  </PaginatorControlProvider>
}
