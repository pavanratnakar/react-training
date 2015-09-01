////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - render DATA.title in an <h1>
// - render a <ul> with each of DATA.items as an <li>
// - now only render an <li> for mexican food (hint: use DATA.items.filter(...))
// - sort the items in alphabetical order by name (hint: use sort-by https://github.com/staygrimm/sort-by#example)
// - try this again without JSX
//
// Got extra time?
// - add a select dropdown to make filtering on `type` dynamic
// - add a button to toggle the sort order
// - Hint: you'll need an `updateThePage` function that calls `React.render`,
//   and then you'll need to call it in the event handlers of the form controls
////////////////////////////////////////////////////////////////////////////////

var React = require('react');
var sortBy = require('sort-by');

var DATA = {
  title: 'Menu',
  items: [
    { id: 1, name: 'tacos', type: 'mexican' },
    { id: 2, name: 'burrito', type: 'mexican' },
    { id: 3, name: 'tostada', type: 'mexican' },
    { id: 4, name: 'hush puppies', type: 'southern' }
  ]
};

var active = 'mexican',
  sort = 1;

function getItems() {
  var t = this;
  // transform object
  var sorted = DATA.items.filter(function (item) {
    return item.type === active;
  }).sort(sortBy(sort === 1 ? 'name' : '-name'));

  return sorted.map(function (item) {
      return <li>{item.name}</li>
  });
};

function onSelectChange(e) {
  active = e.target.value;
  reactRender();
};

function onSortChange(e) {
  active = e.target.value;
  reactRender();
}

function buildSortByType() {
  var uniqueTypes = [];

  DATA.items.map(function (item) {
    if (!uniqueTypes[item.type]) {
      uniqueTypes.push(item.type);
    }
  });

  return <select onChange={onSelectChange}>
    {uniqueTypes.map(function (type) {
      return <option value={type}>{type}</option>
    })}
  </select>
};

function buildSortOrder() {
  var sortTypes = [{
    type: 'ascending',
    value: -1
  }, {
    type: 'descending',
    value: 1
  }];

  return <select onChange={onSortChange}>
    {sortTypes.map(function (item) {
      return <option value={item.value}>{item.type}</option>
    })}
  </select>
};

function buildOptions() {
  return <div>
  {buildSortByType()}
  {buildSortOrder()}
  </div>
};

function render() {
  return (
    <div>
      {buildOptions()}
      <ul>{getItems()}</ul>
    </div>
  );
}

function reactRender() {
  React.render(render(), document.getElementById('app'), function () {
    require('./tests').run(this);
  });
}

reactRender();
