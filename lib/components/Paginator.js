import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PaginatorControls from './PaginatorControls';
import pages from '../utils/pages';

export default class Paginator extends Component {
  static defaultProps = {
    useListElement: false,
    activeTabColor: '#5940be',
    truncate: false,
    maxPageTabs: 5,
    maxPages: null
  }

  static propTypes = {
    wrapper: PropTypes.func.isRequired,
    items: PropTypes.array,
    perPage: PropTypes.number,
    useListElement: PropTypes.bool,
    activeTabColor: PropTypes.string,
    truncate: PropTypes.bool,
    maxPageTabs: PropTypes.number,
    maxPages: PropTypes.number
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

  render() {
    var Container = this.props.wrapper,
      pagesFromItems = pages(this.props.items, this.props.perPage,
        this.props.maxPages);

    return <div>
      {this.props.useListElement ? <ul>
        {pagesFromItems[this.state.currentPage - 1].map((item, i) =>
          <li key={i}><Container item={item} /></li>)}
      </ul> : pagesFromItems[this.state.currentPage - 1].map((item, i) =>
        <Container key={i} item={item} />)}
      <PaginatorControls currentPage={this.state.currentPage}
        pages={pagesFromItems} handlePreviousClick={this.handlePreviousClick}
        handleNextClick={this.handleNextClick} handleClick={this.handleClick}
        activeTabColor={this.props.activeTabColor}
        truncate={this.props.truncate} maxPages={this.props.maxPages}
        maxPageTabs={this.props.maxPageTabs} />
    </div>
  }
}
