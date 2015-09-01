////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - Render the data as tabs, with their `name` as the label in the tab
//   and their `description` inside the tab panel
// - Make it so that you can click a tab label and the panel renders
//   the correct content
// - Make sure the active tab has the active styles
////////////////////////////////////////////////////////////////////////////////

var React = require('react');

var DATA = [
  { id: 1, name: 'USA', description: 'Land of the Free, Home of the brave' },
  { id: 2, name: 'Brazil', description: 'Sunshine, beaches, and Carnival' },
  { id: 3, name: 'Russia', description: 'World Cup 2018!' },
];

var styles = {};

styles.tab = {
  display: 'inline-block',
  padding: 10,
  margin: 10,
  borderBottom: '4px solid',
  borderBottomColor: '#ccc',
  cursor: 'pointer'
};

styles.activeTab = {
  ...styles.tab,
  borderBottomColor: '#000'
};

styles.panel = {
  padding: 10
};

var Tabs = React.createClass({

  getInitialState: function () {
    return {
      activeIndex: 0
    };
  },

  handleClick: function (index, e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      activeIndex: index
    });
  },

  render () {
    var t = this,
      description = '';

    var tabs = this.props.data.map(function (item, index) {
      var s = {};
      if (t.state.activeIndex === index) {
        s = styles.activeTab;
        description = item.description;
      } else {
        s = styles.tab;
      }
      return <div
                onClick={t.handleClick.bind(t, index)}
                id={item.id}
                style={s}
                className="Tabs">
                {item.name}
              </div>
    });

    return <div>
        {tabs}
        <div className="TabPanels" style={styles.panel}>
          {description}
        </div>
      </div>;
  }
});

var App = React.createClass({
  render () {
    return (
      <div>
        <h1>Countries</h1>
        <Tabs data={DATA}/>
      </div>
    );
  }
});

React.render(<App countries={DATA}/>, document.getElementById('app'), function () {
  require('./tests').run(this);
});
