import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PaginatorControls from './PaginatorControls';
import pages from '../utils/pages';
import styled from 'styled-components';

var TableHeaderCell = styled.td`
  &:hover {
    background-color: grey;
  }
`;

export default class TablePaginator extends Component {
  static defaultProps = {
    activeTabColor: '#5940be',
    truncate: false,
    maxPageTabs: 5,
    maxPages: null,
    enumerate: false,
    className: null,
    id: null
  }

  static propTypes = {
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
  }

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleHeaderClick = this.handleHeaderClick.bind(this);

    this.state = {
      currentPage: 1,
      currentColumn: 0,
      ascDesc: true
    }
  }

  handleClick(page) {
    this.setState({ currentPage: page });
  }

  handlePreviousClick(event) {
    this.setState({ currentPage: this.state.currentPage - 1 });
  }

  handleNextClick(event) {
    this.setState({ currentPage: this.state.currentPage + 1 });
  }

  handleHeaderClick(event) {
    var self = this;
    return function(i) {
      if (self.state.currentColumn === i) {
        self.setState({ ascDesc: !self.state.ascDesc });
      }
      else self.setState({ ascDesc: true, currentColumn: i });
    };
  }

  renderHeader() {
    var self = this;
    return (
      <thead>
        <tr>
          {this.props.enumerate ? <td><b>{'#'}</b></td> : null}
          {this.props.columns.map((col, i) =>
            <TableHeaderCell key={i}
              onClick={(e) => self.handleHeaderClick(e)(i)}>
              <b>{col.headerText}</b>
              {' '}
              {this.state.currentColumn === i ?
                <span>
                  {this.state.ascDesc ? '▲' : '▼'}
                </span> : null}
            </TableHeaderCell>)}
        </tr>
      </thead>
    );
  }

  renderPage() {
    var items = this.props.items, cols = this.props.columns,
      currCol = this.state.currentColumn, ascDesc = this.state.ascDesc;
    items.sort((a, b) =>
      cols[currCol].display(a).props.children.toString().localeCompare(
        cols[currCol].display(b).props.children.toString()
      ) * (ascDesc ? 1 : -1));
    var page = (pages(items, this.props.perPage,
        this.props.maxPages))[this.state.currentPage - 1],
      cols = this.props.columns;

    return (
      <tbody>
        {page.map((item, i) =>
          <tr key={i}>
            {this.props.enumerate ? <td>{i}</td> : null}
            {this.props.columns.map((col, j) =>
              <td key={j}>{col.display(item)}</td>)}
          </tr>)}
      </tbody>
    );
  }

  render() {
    var pagesFromItems = pages(this.props.items, this.props.perPage,
        this.props.maxPages), renderHeader = this.renderHeader.bind(this),
      renderPage = this.renderPage.bind(this);

    return [<table key='table-paginator' className={this.props.className}
      id={this.props.id}>
      {renderHeader()}
      {renderPage()}
    </table>,
    <PaginatorControls key='table-paginator-ctrl'
      currentPage={this.state.currentPage}
      pages={pagesFromItems} handlePreviousClick={this.handlePreviousClick}
      handleNextClick={this.handleNextClick} handleClick={this.handleClick}
      activeTabColor={this.props.activeTabColor}
      truncate={this.props.truncate} maxPages={this.props.maxPages}
      maxPageTabs={this.props.maxPageTabs} />]
  }
}
