import React, { useContext }  from 'react';
import PropTypes from 'prop-types';
import PaginatorControlContext, { PaginatorControlProvider } from
  './PaginatorControlContext';
import PaginatorControls from './PaginatorControls';
import pages from '../utils/pages';
import PaginatorSearchBar from './SearchBar';
import { shallowSearch } from '../utils/search';
function PaginatorListDisplay({
  wrapper: Container, thePage, perPage, maxPages }) {
  return <ul>
    {thePage.map((item, i) => <li key={i}><Container item={item} /></li>)}
  </ul>;
}

PaginatorListDisplay.propTypes = {
  wrapper: PropTypes.func.isRequired,
  thePage: PropTypes.array,
  perPage: PropTypes.number,
  maxPages: PropTypes.number,
};

function PaginatorDisplay({ wrapper: Container, thePage, perPage, maxPages }) {
  return thePage.map((item, i) => <Container key={i} item={item} />);
}

PaginatorDisplay.propTypes = {
  wrapper: PropTypes.func.isRequired,
  thePage: PropTypes.array,
  perPage: PropTypes.number,
  maxPages: PropTypes.number,
};

function PaginatorDiv({
  className, id, perPage, maxPages, maxPageTabs, wrapper, useListElement,
  activeTabColor, items, truncate, prePaginated
}) {
  let { state, dispatch } = useContext(PaginatorControlContext);

  let filtered = shallowSearch(items, state.searchQuery),
    thePages = prePaginated ? items : pages(items, perPage, maxPages),
    thePage = thePages[state.currentPage - 1];

  return <div {...{ className, id }}>
    <PaginatorSearchBar />
    {useListElement ?
      <PaginatorListDisplay
        {...{ wrapper, thePage, perPage, maxPages }} /> :
      <PaginatorDisplay {...{ wrapper, thePage, perPage, maxPages }} />}
    <PaginatorControls numPages={thePages.length}
      {...{ activeTabColor, truncate, maxPages, maxPageTabs }} />
  </div>;
}

PaginatorDiv.propTypes = {
  wrapper: PropTypes.func.isRequired,
  items: PropTypes.array,
  perPage: PropTypes.number,
  useListElement: PropTypes.bool,
  activeTabColor: PropTypes.string,
  truncate: PropTypes.bool,
  maxPageTabs: PropTypes.number,
  maxPages: PropTypes.number,
  className: PropTypes.string,
  id: PropTypes.string,
  prePaginated: PropTypes.bool
};

PaginatorDiv.defaultProps = {
  useListElement: false,
  activeTabColor: '#5940be',
  truncate: false,
  maxPageTabs: 5,
  maxPages: null,
  className: null,
  id: null,
  prePaginated: false
};

export default function Paginator(props) {
  return <PaginatorControlProvider>
    <PaginatorDiv {...props} />
  </PaginatorControlProvider>;
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
  id: PropTypes.string,
  prePaginated: PropTypes.bool
};

Paginator.defaultProps = {
  useListElement: false,
  activeTabColor: '#5940be',
  truncate: false,
  maxPageTabs: 5,
  maxPages: null,
  className: null,
  id: null,
  prePaginated: false
};
