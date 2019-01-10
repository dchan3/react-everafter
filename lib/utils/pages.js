const pages = function(items, per, maxPages) {
  var retval = [], page = 0, counter = 0;
  for (var i in items) {
    if (!!maxPages) {
      if (page > maxPages) {
        break;
      }
    }
    if (counter === 0) {
      retval.push([]);
    }
    retval[page].push(items[i]);
    counter++;
    if (counter === per) {
      counter = 0;
      page++;
    }
  }
  return retval;
}

export default pages;
