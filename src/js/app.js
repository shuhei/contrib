/** @jsx React.DOM */

'use strict';

var React = require('react');

var Contributions = React.createClass({
  colors: [
    '#eeeeee',
    '#d6e685',
    '#8cc665',
    '#44a340',
    '#1e6823'
  ],
  colorIndex: function (count) {
    if (count <= 0) return 0;
    else if (count <= 3) return 1;
    else if (count <= 6) return 2;
    else if (count <= 9) return 3;
    else return 4;
  },
  aggregateWeeks: function (days) {
    var firstDay = new Date(this.props.items[0][0]);
    var offset = firstDay.getDay();
    var weeks = [];
    var days;

    for (var i = 0; i < this.props.items.length + offset; i++) {
      if (i % 7 === 0) {
        days = [];
        weeks.push(days);
      }
      if (i < offset) {
        days.push(null);
      } else {
        days.push(this.props.items[i - offset]);
      }
    }
    return weeks;
  },
  render: function () {
    var self = this;

    if (this.props.items.length === 0) {
      return <p>No Data</p>;
    }

    var size = 15;
    var margin = 4;
    var weeks = self.aggregateWeeks();

    var groups = weeks.map(function (week, i) {
      var rects = week.map(function (day, j) {
        if (day == null) return null;
        var style = { fill: self.colors[self.colorIndex(day[1])] };
        var y = j * (size + margin);
        return <rect width={size} height={size} y={y} x={0} style={style} key={day[0]} />;
      }).filter(Boolean);
      var transform = 'translate(' + i * (size + margin) + ',0)';
      return <g transform={transform} key={'week-' + i}>{rects}</g>;
    });

    return (
      <svg width="100%" height={500}>{groups}</svg>
    );
  }
});

var Page = React.createClass({
  getInitialState: function () {
    return {
      contribs: [],
      loading: false
    };
  },
  componentDidMount: function () {
    var self = this;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        self.setState({
          loading: false,
          contribs: JSON.parse(xhr.responseText)
        });
      } else {
        self.setState({ loading: false });
        console.log('Something went wrong.', xhr.status);
      }
    };
    xhr.open('GET', '/contributions/shuhei');
    this.setState({ loading: true });
    xhr.send(null);
  },
  render: function () {
    return (
      <div>
        <h1>{this.props.title}</h1>
        {this.state.loading ?
          <p key="loading">Loading</p> :
          <Contributions items={this.state.contribs} />
        }
      </div>
    );
  }
});

React.renderComponent(
  <Page title="Github Contributions" />,
  document.getElementById('page')
);
