import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import PaginatorControls from './PaginatorControls';
import PaginatorControlContext, {
  PaginatorControlProvider } from './PaginatorControlContext';
import pages from '../utils/pages';
import styled from 'styled-components';
import { renderToString } from 'react-dom/server';

let TableHeaderCell = styled.td`
  &:hover {
    background-color: grey;
  }
`;

function TablePaginatorDisplay({
  enumerate, items, columns, maxPages, perPage, className, id
}) {

  let { state, dispatch } = useContext(PaginatorControlContext);

  function handleHeaderClick(i) {
    if (state.currentColumn === i) {
      return dispatch({ type: 'toggle' });
    }
    else return dispatch({ type: 'column', val: i });
  }

  function renderHeader() {
    return (
      <thead>
        <tr>
          {enumerate ? <td><b>{'#'}</b></td> : null}
          {columns.map(({ headerText }, i) =>
            <TableHeaderCell key={i} onClick={() => handleHeaderClick(i)}>
              <b>{headerText}</b>
              {' '}
              {state.currentColumn === i ?
                <span>{state.ascDesc ? '▲' : '▼'}</span> : null}
            </TableHeaderCell>)}
        </tr>
      </thead>
    );
  }

  function renderPage(currPage) {
    items.sort((a, b) => {
      let dispA = columns[state.currentColumn].display(a),
        dispB = columns[state.currentColumn].display(b);
      return (dispA.props ? renderToString(dispA) : dispA.toString())
        .localeCompare((dispB.props ? renderToString(dispB) : dispB.toString())
        ) * (state.ascDesc ? 1 : -1)
    });

    return (
      <tbody>
        {currPage.map((item, i) =>
          <tr key={i}>
            {enumerate ? <td>{i}</td> : null}
            {columns.map((col, j) =>
              <td key={j}>{col.display(item)}</td>)}
          </tr>)}
      </tbody>
    );
  }

  let pagesFromItems = pages(items, perPage, maxPages);

  return (
    <table key='table-paginator' {...{ className, id }}>
      {renderHeader()}
      {renderPage(pagesFromItems[state.currentPage - 1])}
    </table>
  );
}

TablePaginatorDisplay.propTypes = {
  items: PropTypes.array,
  columns: PropTypes.arrayOf(PropTypes.shape({
    headerText: PropTypes.string,
    display: PropTypes.func
  })),
  enumerate: PropTypes.bool,
  perPage: PropTypes.number,
  maxPages: PropTypes.number,
  className: PropTypes.string,
  id: PropTypes.string
};

function TablePaginator({
  activeTabColor, truncate, maxPageTabs, maxPages, enumerate, className, id,
  columns, items, perPage
}) {
  let pagesFromItems = pages(items, perPage, maxPages);

  return <PaginatorControlProvider>
    <TablePaginatorDisplay
      {...{ items, columns, enumerate, perPage, maxPages, className, id }} />
    <PaginatorControls key='table-paginator-ctrl' pages={pagesFromItems}
      {...{ activeTabColor, truncate, maxPages, maxPageTabs }} />
  </PaginatorControlProvider>;
}

TablePaginator.propTypes = {
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

TablePaginator.defaultProps = {
  activeTabColor: '#5940be',
  truncate: false,
  maxPageTabs: 5,
  maxPages: null,
  enumerate: false,
  className: null,
  id: null
};

export default TablePaginator;