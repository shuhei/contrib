/** @jsx React.DOM */

'use strict';

var React = require('react');

var Color = {
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
  forCount: function (count) {
    return this.colors[this.colorIndex(count)];
  }
};

var Contributions = React.createClass({
  aggregateWeeks: function () {
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
  renderLandscape: function (weeks) {
    var self = this;
    var size = 4;
    var margin = 1;

    var groups = weeks.map(function (week, i) {
      var rects = week.map(function (day, j) {
        if (day == null) return null;
        var style = { fill: Color.forCount(day[1]) };
        var y = j * (size + margin);
        return <rect width={size} height={size} y={y} x={0} style={style} key={day[0]} />;
      }).filter(Boolean);
      var transform = 'translate(' + i * (size + margin) + ',0)';
      return <g transform={transform} key={'week-' + i}>{rects}</g>;
    });

    return (
      <svg width={53 * (size + margin)} height={7 * (size + margin)}>{groups}</svg>
    );
  },
  renderPortrait: function (weeks) {
    var self = this;
    var size = 20;
    var margin = 6;

    var groups = weeks.reverse().map(function (week, i) {
      var rects = week.reverse().map(function (day, j) {
        if (day == null) return null;
        var style = { fill: Color.forCount(day[1]) };
        var x = j * (size + margin);
        return <rect width={size} height={size} x={x} y={0} style={style} key={day[0]} />;
      }).filter(Boolean);
      var transform = 'translate(0,' + i * (size + margin) + ')';
      return <g transform={transform} key={'week-' + i}>{rects}</g>;
    });

    return (
      <svg width={7 * (size + margin)} height={53 * (size + margin)}>{groups}</svg>
    );
  },
  render: function () {
    if (this.props.items.length === 0) {
      return <p>No Data</p>;
    }

    var weeks = this.aggregateWeeks();

    if (this.props.isPortrait) return this.renderPortrait(weeks);
    else return this.renderLandscape(weeks);
  }
});

var Page = React.createClass({
  getInitialState: function () {
    return {
      contribs: [],
      isLoading: false,
      isPortrait: window.orientation === 0
    };
  },
  componentDidMount: function () {
    var self = this;

    // Get contributions calendar from Github.
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        self.setState({
          isLoading: false,
          contribs: JSON.parse(xhr.responseText)
        });
      } else {
        self.setState({ isLoading: false });
        console.log('Something went wrong.', xhr.status);
      }
    };
    xhr.open('GET', '/contributions/shuhei');
    this.setState({ isLoading: true });
    xhr.send(null);

    // Watch device orientation.
    window.addEventListener('orientationchange', function () {
      self.setState({ isPortrait: window.orientation === 0 });
    });
  },
  render: function () {
    return (
      <div>
        <h1>{this.props.title}</h1>
        {this.state.isLoading ?
          <p key="loading">Loading</p> :
          <Contributions items={this.state.contribs} isPortrait={this.state.isPortrait} />
        }
      </div>
    );
  }
});

React.renderComponent(
  <Page title="Github Contributions" />,
  document.getElementById('page')
);
