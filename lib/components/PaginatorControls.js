import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PaginatorControlContext from './PaginatorControlContext';
import { default as truncatePageList, generateArray }
  from '../utils/truncate_page_list';

const PaginatorContainer = styled.div`
  clear: both;
  width: 100%;
  margin: 0 auto;
`, PaginatorButton = styled.li`
  text-align: center;
  border: thin grey solid;
  padding: 5px;
  width: 35px;
  height: 35px;
  display: inline-block;
  font-size: 1.15em;
  &:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  &:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
  &:hover:not(.active) {
    color: white;
    background-color: black;
  }
  &.active {
    background-color: ${({ activeTabColor }) => activeTabColor};
    color: white;
  }
`, PaginatorList = styled.ul`
  list-style: none;
  padding-left: 0;
  display: inline;
`, PaginatorNumber = styled.a`
  color: inherit;
  font-size: inherit;
`;
export default function PaginatorControls() {
  let { state, dispatch } = useContext(PaginatorControlContext),
    { maxPages, maxPageTabs, currentPage, truncate, activeTabColor, pages } =
    state, truncated = truncate ?
      truncatePageList(maxPages ? maxPages : pages.length,
        maxPageTabs || 5, currentPage) : undefined;

  function isActive(page) {
    return currentPage === page ? 'active' : '';
  }

  return <PaginatorContainer>
    <PaginatorList>
      {currentPage > 1 && <PaginatorButton onClick={() =>
        dispatch({ type: 'page', val: '-' })}>
        <PaginatorNumber>{'<'}</PaginatorNumber>
      </PaginatorButton> || null}
      {truncated ? (truncated.map(n => <PaginatorButton {...{ activeTabColor }}
        onClick={(n !== null && !!n) ? () => dispatch({ type: 'page', val: n })
          : null} className={(n !== null && !!n) ? isActive(n) : ''}>
        <PaginatorNumber>{(n !== null && !!n) ? n : '⋯'}</PaginatorNumber>
      </PaginatorButton>)) : generateArray(pages.length).map(i => (
        <PaginatorButton {...{ activeTabColor }}
          onClick={() => dispatch({ type: 'page', val: i + 1 })}
          className={isActive(i + 1)}>
          <PaginatorNumber>{i + 1}</PaginatorNumber>
        </PaginatorButton>))}
      {currentPage < pages.length && <PaginatorButton onClick={() => dispatch({
        type: 'page', val: '+' })}>
        <PaginatorNumber>{'>'}</PaginatorNumber>
      </PaginatorButton> || null}
    </PaginatorList>
  </PaginatorContainer>;
}
