import React, { useContext, useEffect }  from 'react';
import PropTypes from 'prop-types';
import PaginatorControlContext, { PaginatorControlProvider } from
  './PaginatorControlContext';
import PaginatorControls from './PaginatorControls';

function PaginatorSearchBar() {
  let { state: { searchQuery }, dispatch } =
    useContext(PaginatorControlContext);

  function handleSearchChange(event) {
    dispatch({ type: 'query', val: event.target.value });
  }

  return <input type="text" placeholder="Search" value={searchQuery || ''}
    onChange={handleSearchChange}/>;
}

function PaginatorListDisplay() {
  let { state: { thePage, wrapper: Container } } =
    useContext(PaginatorControlContext);

  return <ul>{thePage.map(item => <li>
    <Container {...{ item }} /></li>)}</ul>;
}

function PaginatorDisplay() {
  let { state: { thePage, wrapper: Container } } =
    useContext(PaginatorControlContext);

  return thePage.map((item, key) => <Container {...{ item }} />);
}

function PaginatorView() {
  let { state: { useListElement, className, id } } =
    useContext(PaginatorControlContext),
    DisplayComponent = useListElement ? PaginatorListDisplay : PaginatorDisplay;

  return <div {...{ className, id }}>
    <DisplayComponent />
    <PaginatorControls />
  </div>;
}

function PaginatorTop() {
  return <div>
    <PaginatorSearchBar />,
    <PaginatorView />
  </div>;
}

export default function Paginator(props) {
  return <PaginatorControlProvider initialVals={{ ...props }}>
    <PaginatorTop />
  </PaginatorControlProvider>
}

Paginator.propTypes = {
  wrapper: PropTypes.func,
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
