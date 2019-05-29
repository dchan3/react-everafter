import React, { useContext }  from 'react';
import PropTypes from 'prop-types';
import PaginatorControlContext, { PaginatorControlProvider } from
  './PaginatorControlContext';
import PaginatorControls from './PaginatorControls';
import pages from '../utils/pages';

function PaginatorListDisplay({
  wrapper, items, perPage, maxPages }) {
  let Container = wrapper, pagesFromItems = pages(items, perPage, maxPages);

  let { state } = useContext(PaginatorControlContext);

  return <ul>
    {pagesFromItems[state.currentPage - 1].map((item, i) =>
      <li key={i}><Container item={item} /></li>)}
  </ul>;
}

PaginatorListDisplay.propTypes = {
  wrapper: PropTypes.func.isRequired,
  items: PropTypes.array,
  perPage: PropTypes.number,
  maxPages: PropTypes.number,
};

function PaginatorDisplay({ wrapper, items, perPage, maxPages }) {
  let Container = wrapper,
    pagesFromItems = pages(items, perPage, maxPages);

  let { state } = useContext(PaginatorControlContext);

  return pagesFromItems[state.currentPage - 1].map((item, i) =>
    <Container key={i} item={item} />);
}

PaginatorDisplay.propTypes = {
  wrapper: PropTypes.func.isRequired,
  items: PropTypes.array,
  perPage: PropTypes.number,
  maxPages: PropTypes.number,
};

function Paginator({
  className, id, perPage, maxPages, maxPageTabs, wrapper, useListElement,
  activeTabColor, items, truncate
}) {
  let pagesFromItems = pages(items, perPage, maxPages);

  return <PaginatorControlProvider><div {...{ className, id }}>
    {useListElement ?
      <PaginatorListDisplay
        {...{ wrapper, items, perPage, maxPages }} /> :
      <PaginatorDisplay {...{ wrapper, items, perPage, maxPages }} />}
    <PaginatorControls pages={pagesFromItems}
      {...{ activeTabColor, truncate, maxPages, maxPageTabs }} />
  </div></PaginatorControlProvider>;
}

Paginator.propTypes = {
  wrapper: PropTypes.func.isRequired,
  items: PropTypes.array,
  perPage: PropTypes.number,
  useListElement: PropTypes.bool,
  activeTabColor: PropTypes.string,
  truncate: PropTypes.bool,
  maxPageTabs: PropTypes.number,
  maxPages: PropTypes.number,
  className: PropTypes.string,
  id: PropTypes.string
};

Paginator.defaultProps = {
  useListElement: false,
  activeTabColor: '#5940be',
  truncate: false,
  maxPageTabs: 5,
  maxPages: null,
  className: null,
  id: null
};

export default Paginator;