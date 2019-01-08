import React, { Component } from 'react';
import { expect } from 'chai';
import Enzyme, { render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Paginator from '../lib/components/Paginator';
import pages from '../lib/utils/pages';
import PaginatorControls from '../lib/components/PaginatorControls';
import PropTypes from 'prop-types';
Enzyme.configure({ adapter: new Adapter() });

class TestComponent extends Component {
  static propTypes = {
    item: PropTypes.any.isRequired
  }

  render() {
    return <div>{this.props.item}</div>
  }
}

describe('pages function', function() {
  it('works with even divisibility', function(done) {
    var actual = pages([1,2,3,4,5,6,7,8,9], 3), expected = [
      [1,2,3],
      [4,5,6],
      [7,8,9]
    ];
    expect(actual).to.deep.equal(expected);
    done();
  });

  it('works with remainder', function(done) {
    var actual = pages([1,2,3,4,5,6,7], 4), expected = [
      [1,2,3,4],
      [5,6,7]
    ];
    expect(actual).to.deep.equal(expected);
    done();
  });
});

describe('Controls Render', function() {
  it('renders correctly when even', function(done) {
    const wrapper = render(<PaginatorControls currentPage={1}
      handleClick={function() {}}
      handlePreviousClick={function() {}}
      handleNextClick={function() {}}
      pages={pages([1,2,3,4,5,6,7,8], 4)} />);
    expect(wrapper.find('li')).to.be.lengthOf(3);
    done();
  });

  it('renders correctly with remainder', function(done) {
    const wrapper = render(<PaginatorControls currentPage={3}
      handleClick={function() {}}
      handlePreviousClick={function() {}}
      handleNextClick={function() {}}
      pages={pages([1,2,3,4,5,6,7,8,9,10], 3)} />);
    expect(wrapper.find('li')).to.be.lengthOf(6);
    done();
  });
});

describe('Paginator Render when useListElement false or undefined', function() {
  it('renders correctly', function(done) {
    const wrapper = render(<Paginator wrapper={TestComponent}
      items={[1,2,3,4,5,6,7,8,9,10]} perPage={3} />);
    expect(wrapper.find('ul')).to.be.lengthOf(1);
    done();
  });
});

describe('Paginator Render when useListElement true', function() {
  it('renders correctly', function(done) {
    const wrapper = render(<Paginator wrapper={TestComponent}
      items={[1,2,3,4,5,6,7,8]} perPage={5} useListElement={true} />);
    expect(wrapper.find('ul')).to.be.lengthOf(2);
    done();
  });
});
