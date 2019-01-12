import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PaginatorControls from './PaginatorControls';
import pages from '../utils/pages';

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

    this.state = {
      currentPage: 1
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

  renderHeader() {
    return (
      <thead>
        <tr>
          {this.props.enumerate ? <td><b>{'#'}</b></td> : null}
          {this.props.columns.map((col, i) =>
            <td key={i}><b>{col.headerText}</b></td>)}
        </tr>
      </thead>
    );
  }

  renderPage() {
    var page = (pages(this.props.items, this.props.perPage,
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
