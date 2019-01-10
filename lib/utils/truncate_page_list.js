const generateArray = function() {
  var retval = [], n = arguments[0], k = arguments[1];

  for (var i = (k !== undefined ? n : 1); i <= (k !== undefined ? k : n); i++) {
    retval.push(i);
  }

  return retval;
}

const truncatePageList = function(numberOfPages, maxPageTabs, currentPage) {
  if (numberOfPages <= maxPageTabs) {
    return generateArray(numberOfPages);
  }

  var half = Math.floor(maxPageTabs / 2);

  if (currentPage === numberOfPages) {
    return generateArray(half).concat([null])
      .concat(generateArray(numberOfPages - half, numberOfPages));
  }

  if (currentPage <= half) {
    return generateArray(half * 2 - 1)
      .concat([null, numberOfPages - 1, numberOfPages]);
  }

  var quarter = Math.floor(half / 2);

  return [1, null].concat(
    generateArray(currentPage - quarter, currentPage + quarter))
    .concat([null, numberOfPages]);
}

export default truncatePageList;
