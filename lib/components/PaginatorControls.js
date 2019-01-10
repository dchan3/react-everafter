import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { default as truncatePageList } from '../utils/truncate_page_list';

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
    background-color: ${props => props.activeTabColor};
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

export default class PaginatorControls extends Component {
  static propTypes = {
    handlePreviousClick: PropTypes.func.isRequired,
    handleNextClick: PropTypes.func.isRequired,
    handleClick: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    pages: PropTypes.array,
    activeTabColor: PropTypes.string,
    maxPages: PropTypes.number,
    maxPageTabs: PropTypes.number,
    truncate: PropTypes.bool
  }

  constructor(props) {
    super(props);

    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.isActive = this.isActive.bind(this);
  }

  handlePreviousClick() {
    this.props.handlePreviousClick();
  }

  handleNextClick() {
    this.props.handleNextClick();
  }

  handleClick(page) {
    this.props.handleClick(page);
  }

  isActive(page) {
    if (this.props.currentPage === page) return ' active';
    return '';
  }

  render() {
    var self = this, truncated = this.props.truncate ?
      truncatePageList(this.props.maxPages || this.props.pages.length,
        this.props.maxPageTabs, this.props.currentPage) : undefined;

    return (
      <PaginatorContainer>
        <PaginatorList>
          {this.props.currentPage > 1 &&
            <PaginatorButton onClick={self.handlePreviousClick}>
              <PaginatorNumber>{'<'}</PaginatorNumber></PaginatorButton>|| null}
          {truncated ? truncated.map((n, i) =>
            <PaginatorButton key={i}
              activeTabColor={self.props.activeTabColor}
              onClick={n !== null ?
                (e) => { self.handleClick(n); } : null}
              className={n !== null ? self.isActive(n) : ''}>
              <PaginatorNumber>{n !== null ? n : '⋯'}</PaginatorNumber>
            </PaginatorButton>
          ) :
            this.props.pages.map(function(page, i) {
              return (
                <PaginatorButton key={i}
                  activeTabColor={self.props.activeTabColor}
                  onClick={(e) => { self.handleClick(i + 1); }}
                  className={self.isActive(i + 1)}>
                  <PaginatorNumber>{i + 1}</PaginatorNumber>
                </PaginatorButton>);
            })}
          {this.props.currentPage < this.props.pages.length &&
            <PaginatorButton onClick={self.handleNextClick}>
              <PaginatorNumber>{'>'}</PaginatorNumber>
            </PaginatorButton> || null}
        </PaginatorList>
      </PaginatorContainer>
    );
  }
}
