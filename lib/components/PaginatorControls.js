import React, { useContext, useReducer } from 'react';
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
function PaginatorControls({
  numPages, activeTabColor, maxPages, maxPageTabs, truncate
}) {
  const { state, dispatch } = useContext(PaginatorControlContext);

  function isActive(page) {
    return state.currentPage === page ? ' active' : '';
  }

  let truncated = () => truncate ?
    truncatePageList(maxPages || numPages,
      maxPageTabs, state.currentPage) : undefined;

  return (
    <PaginatorContainer>
      <PaginatorList>
        {state.currentPage > 1 &&
        <PaginatorButton onClick={
          () => dispatch({ type: 'page', val: '-' })}>
          <PaginatorNumber>{'<'}</PaginatorNumber>
        </PaginatorButton> || null}
        {truncated(state.currentPage) ?
          truncated(state.currentPage).map((n, i) =>
            <PaginatorButton key={i} activeTabColor={activeTabColor}
              onClick={n !== null ?
                () => dispatch({ type: 'page', val: n }) : null}
              className={n !== null ? isActive(n) : ''}>
              <PaginatorNumber>{n !== null ? n : '⋯'}</PaginatorNumber>
            </PaginatorButton>
          ) : generateArray(numPages).map(i => (
            <PaginatorButton key={i} {...{ activeTabColor }}
              onClick={() => dispatch({ type: 'page', val: i + 1 })}
              className={isActive(i + 1)}>
              <PaginatorNumber>{i + 1}</PaginatorNumber>
            </PaginatorButton>))}
        {state.currentPage < numPages &&
        <PaginatorButton onClick={() =>
          dispatch({ type: 'page', val: '+' })}>
          <PaginatorNumber>{'>'}</PaginatorNumber>
        </PaginatorButton> || null}
      </PaginatorList>
    </PaginatorContainer>
  );
}

PaginatorControls.propTypes = {
  numPages: PropTypes.number,
  activeTabColor: PropTypes.string,
  maxPages: PropTypes.number,
  maxPageTabs: PropTypes.number,
  truncate: PropTypes.bool
};

export default PaginatorControls;
