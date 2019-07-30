import React, { Component } from 'react';
import { expect } from 'chai';
import Enzyme, { render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Paginator from '../lib/components/Paginator';
import { PaginatorControlProvider } from
  '../lib/components/PaginatorControlContext';
import TablePaginator from '../lib/components/TablePaginator';
import pages from '../lib/utils/pages';
import truncatePageList from '../lib/utils/truncate_page_list';
import { shallowSearch } from '../lib/utils/search';
import PaginatorControls from '../lib/components/PaginatorControls';
import { any } from 'prop-types';
Enzyme.configure({ adapter: new Adapter() });

function TestComponent({ item }) {
  return <div>{item}</div>
}

TestComponent.propTypes = {
  item: any.isRequired
};

describe('pages function', function() {
  it('works with even divisibility', function(done) {
    var actual = pages([1,2,3,4,5,6,7,8,9], 3, null), expected = [
      [1,2,3],
      [4,5,6],
      [7,8,9]
    ];
    expect(actual).to.deep.equal(expected);
    done();
  });

  it('works with remainder', function(done) {
    var actual = pages([1,2,3,4,5,6,7], 4, null), expected = [
      [1,2,3,4],
      [5,6,7]
    ];
    expect(actual).to.deep.equal(expected);
    done();
  });

  it('works with maxPages', function(done) {
    var actual = pages([1,2,3,4,5,6,7,8,9,10], 4, 2), expected = [
      [1,2,3,4],
      [5,6,7,8]
    ];
    expect(actual).to.deep.equal(expected);
    done();
  });
});

describe('truncate page list function', function() {
  it('works when maxPageTabs >= numberOfPages', function(done) {
    expect(truncatePageList(5, 7, 2)).to.deep.equal([1,2,3,4,5]);
    done();
  });

  it('works when currentPage == 1', function(done) {
    expect(truncatePageList(8, 5, 1)).to.deep.equal([1, 2, 3, null, 7, 8]);
    done();
  });

  it('works when currentPage <= half', function(done) {
    expect(truncatePageList(12, 5, 2)).to.deep.equal([1, 2, 3, null, 11, 12]);
    done();
  });

  it('works when currentPage == numberOfPages', function(done) {
    expect(truncatePageList(10, 5, 10)).to.deep.equal([1, 2, null, 8, 9, 10]);
    done();
  });

  it('works when currentPage == numberOfPages - 1', function(done) {
    expect(truncatePageList(8, 5, 7)).to.deep.equal([1, null, 6, 7, 8]);
    done();
  });

  it('works when currentPage is anything else', function(done) {
    expect(truncatePageList(10, 5, 6)).to.deep.equal(
      [1, null, 5, 6, 7, null, 10]);
    done();
  });
});

describe('Controls Render', function() {
  it('renders correctly when even', function(done) {
    const wrapper = render(<PaginatorControlProvider initialVals={{
      items: [1,2,3,4,5,6,7,8],
      perPage: 4,
      currentPage: 1
    }}>
      <PaginatorControls />
    </PaginatorControlProvider>);
    expect(wrapper.find('li')).to.be.lengthOf(3);
    done();
  });

  it('renders correctly with remainder', function(done) {
    const wrapper = render(<PaginatorControlProvider initialVals={{
      items: [1,2,3,4,5,6,7,8,9,10],
      perPage: 3,
      currentPage: 1
    }}>
      <PaginatorControls />
    </PaginatorControlProvider>);
    expect(wrapper.find('li')).to.be.lengthOf(5);
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
      items={[1,2,3,4,5,6,7,8,9]} perPage={5} useListElement={true}
      currentPage={2} />);
    expect(wrapper.find('li')).to.be.lengthOf(8);
    expect(wrapper.find('ul')).to.be.lengthOf(2);
    done();
  });
});

describe('Table Paginator Render when enumerate false', function() {
  it('renders correctly with non-JSX display', function(done) {
    const wrapper = render(<TablePaginator columns={[{
      'headerText': 'ID #',
      'display': item => item
    }]} items={[1,2,3,4,5,6,7,8]} perPage={5} />);
    expect(wrapper.find('tr')).to.be.lengthOf(6);
    expect(wrapper.find('b').text()).to.equal('ID #');
    done();
  });

  it('renders correctly with JSX display', function(done) {
    const wrapper = render(<TablePaginator columns={[{
      'headerText': 'ID #',
      'display': item => <p>{item}</p>
    }]} items={[1,2,3,4,5,6,7,8]} perPage={5} />);
    expect(wrapper.find('tr')).to.be.lengthOf(6);
    expect(wrapper.find('b').text()).to.equal('ID #');
    done();
  });
});

describe('Search functions', function() {
  it('shallow search - non-objects', function(done) {
    var items = ["foo", "bar", "baz"], expected = ['bar', 'baz'];
    expect(shallowSearch(items, "ba")).to.deep.equal(expected);
    done();
  });

  it('shallow search - non-objects with space', function(done) {
    var items = ["Alpha Beta", "Alpha Omega", "Alpha Tau"],
      expected = ["Alpha Beta", "Alpha Omega"];
    expect(shallowSearch(items, "Alp e")).to.deep.equal(expected);
    done();
  });

  it('shallow search - objects', function(done) {
    var items = [{
      "name": "John Doe",
      "yearInducted": "1991",
    },
    {
      "name": "Heidi Sky",
      "yearInducted": "1991",
    },
    {
      "name": "John Snow",
      "yearInducted": "2000",
    }], expected1 = [{
      "name": "John Doe",
      "yearInducted": "1991",
    }, {
      "name": "Heidi Sky",
      "yearInducted": "1991",
    }], expected2 = [{
      "name": "John Doe",
      "yearInducted": "1991",
    }, {
      "name": "John Snow",
      "yearInducted": "2000",
    }];
    expect(shallowSearch(items, "1991")).to.deep.equal(expected1);
    expect(shallowSearch(items, "John")).to.deep.equal(expected2);
    done();
  });

  it('deep search', function(done) {
    done();
  });
});
