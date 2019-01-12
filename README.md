# react-everafter

[![NPM version](https://img.shields.io/npm/v/react-everafter.svg?style=flat)](https://www.npmjs.com/package/react-everafter)
![npm](https://img.shields.io/npm/dt/react-everafter.svg)
[![Build Status](https://travis-ci.org/dchan3/react-everafter.svg?branch=master)](https://travis-ci.org/dchan3/react-everafter)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/453fef0486e84ef1b3d6e5ce57120446)](https://www.codacy.com/app/dchan3/react-everafter?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=dchan3/react-everafter&amp;utm_campaign=Badge_Grade)

## Introduction
This package aims to make pagination generation easier to customize.

## Installation
`npm i react-everafter -S`

## Components
### `EverAfter.Paginator`
-   `items`: `Array`. Items to be paginated, preferably objects.
-   `wrapper`: `React.Component`. Container for items. Should use attributes of objects in `items`.
-   `perPage`: `Number`. Number of items per page.
-   `useListElement`: `Boolean`. True if items are to be put in `ul` list items. Value defaults to `false`.
-   `activeTabColor`: `String`. CSS background-color value of tabs when active.
-   `truncate`: `Boolean`. Value defaults to `false`.
-   `maxPageTabs`: `Number`. Maximum number of page tabs to display. Defaults to `5`.
-   `maxPages`: `Number`. Maximum number of pages to render. Defaults to `null`.

### `EverAfter.TablePaginator`
Paginated Table. Properties are the same as those of `EverAfter.Paginator`, except `useListElement`. Additional properties are listed.
-   `columns`: `Array`. Must contain objects with keys `headerText` and `display`. `headerText` dictates the text in the column header. `display` is a `Function` that takes `item` as sole parameter. Dictates how the item is rendered in the column.
-   `enumerate`: `Boolean`. Numbers items if set to `true`. Defaults to `false`.

## Example Usage
```Javascript
import React, { Component } from 'react';
import EverAfter from 'react-everafter';

var items = [{n: 1}, {n: 2}, {n: 3}, {n: 4}, {n: 5}];

class MyItemContainer extends Component {
  render() {
    return <div>{this.prop.item.n}</div>
  }
}

class MyList extends Component {
  render() {
    return <EverAfter.Paginator items={items} wrapper={MyItemContainer} perPage={2} useListElement={true} />
  }
}
```
