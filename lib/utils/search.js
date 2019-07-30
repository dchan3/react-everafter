const strQuery = (str, query) => query.split(' ').reduce(
  (acc, cur) => acc && !!str.match(new RegExp(cur, 'i')), true);

export function shallowSearch(items, query) {
  var retval = [];
  if (query === '') return items;
  items.forEach(item => {
    if (typeof item !== 'object') {
      if (strQuery(item.toString(), query)) {
        retval.push(item);
      }
    }
    if (typeof item === 'object') {
      for (var k in item) {
        if (strQuery(item[k].toString(), query)) {
          retval.push(item);
          break;
        }
      }
    }
  });
  return retval;
}

export function deepSearch(items, query) {
  var retval = [];
  items.forEach(item => {
    for (var k in query) {

    }
  });
}
