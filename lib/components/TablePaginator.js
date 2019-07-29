import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import PaginatorControls from './PaginatorControls';
import PaginatorControlContext, {
  PaginatorControlProvider } from './PaginatorControlContext';
import pages from '../utils/pages';
import styled from 'styled-components';
import { renderToString } from 'react-dom/server';
import { shallowSearch } from '../utils/search';

let TableHeaderCell = styled.td`
  &:hover {
    background-color: grey;
  }
`;

function TablePaginatorDisplay({
  enumerate, thePage, columns, maxPages, perPage, className, id
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
    return <tbody>
      {currPage.map((item, i) =>
        <tr key={i}>
          {enumerate ? <td>{i}</td> : null}
          {columns.map((col, j) =>
            <td key={j}>{col.display(item)}</td>)}
        </tr>)}
    </tbody>;
  }

  return <table key='table-paginator' {...{ className, id }}>
    {renderHeader()}
    {renderPage(thePage)}
  </table>;
}

TablePaginatorDisplay.propTypes = {
  thePage: PropTypes.array,
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

function TablePaginatorDiv({
  activeTabColor, truncate, maxPageTabs, maxPages, enumerate, className, id,
  columns, items, perPage, prePaginated
}) {
  let { state, dispatch } = useContext(PaginatorControlContext),
    filtered = shallowSearch(items, state.searchQuery),
    thePages = (prePaginated ? filtered : pages(filtered, perPage, maxPages));

  thePages.sort((a, b) => {
    let dispA = columns[state.currentColumn].display(a),
      dispB = columns[state.currentColumn].display(b);
    return (dispA.props ? renderToString(dispA) : dispA.toString())
      .localeCompare((dispB.props ? renderToString(dispB) : dispB.toString())
      ) * (state.ascDesc ? 1 : -1)
  });

  let thePage = thePages[state.currentPage - 1];

  return <div>
    <TablePaginatorDisplay
      {...{ thePage, columns, enumerate, perPage, maxPages, className, id }} />
    <PaginatorControls key='table-paginator-ctrl' pages={thePages.length}
      {...{ activeTabColor, truncate, maxPages, maxPageTabs }} />
  </div>;
}

TablePaginatorDiv.propTypes = {
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
  id: PropTypes.string,
  prePaginated: PropTypes.bool
};

TablePaginatorDiv.defaultProps = {
  activeTabColor: '#5940be',
  truncate: false,
  maxPageTabs: 5,
  maxPages: null,
  enumerate: false,
  className: null,
  id: null,
  prePaginated: false
};

export default function TablePaginator(props) {
  return <PaginatorControlProvider>
    <TablePaginatorDiv {...props} />
  </PaginatorControlProvider>
};

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
  id: PropTypes.string,
  prePaginated: PropTypes.bool
};

TablePaginator.defaultProps = {
  activeTabColor: '#5940be',
  truncate: false,
  maxPageTabs: 5,
  maxPages: null,
  enumerate: false,
  className: null,
  id: null,
  prePaginated: false
};
