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

var Month = {
  names: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],
  forIndex: function (index) {
    return this.names[index];
  }
};

var PortraitContributions = React.createClass({
  size: 20,
  margin: 6,
  unit: function () {
    return this.size + this.margin;
  },
  weekGroups: function () {
    var self = this;
    return this.props.weeks.reverse().map(function (week, i) {
      var offset = 7 - week.length;
      var rects = week.reverse().map(function (day, j) {
        if (day == null) return null;
        var style = { fill: Color.forCount(day[1]) };
        var x = (j + offset) * self.unit();
        return <rect width={self.size} height={self.size} x={x} y={0} style={style} key={day[0]} />;
      }).filter(Boolean);
      var transform = 'translate(0,' + i * self.unit() + ')';
      var key = 'week-' + i;
      return <g transform={transform} key={key}>{rects}</g>;
    });
  },
  textGroup: function () {
    var self = this;
    var texts = self.props.months.map(function (month, i) {
      var y = (self.props.weeks.length - 1 - month[1] - 1) * self.unit() + self.size / 2 + 5;
      var key = 'month-' + i;
      return <text x="0" y={y} key={key} className="month">{Month.forIndex(month[0])}</text>;
    });
    var transform = 'translate(' + self.unit() * 7 + ',0)';
    return <g transform={transform} key="months">{texts}</g>;
  },
  render: function () {
    var groups = this.weekGroups();
    groups.push(this.textGroup());

    var width = 7 * this.size + 6 * this.margin + 30 * 2;
    var height = 53 * this.unit();
    return (
      <svg width={width} height={height} className="matrix">
        <g transform="translate(30,0)">{groups}</g>
      </svg>
    );
  }
});

var Contributions = React.createClass({
  render: function () {
    if (this.props.items.length === 0) {
      return <p>No Data</p>;
    }

    var firstDay = new Date(this.props.items[0][0]);
    var offset = firstDay.getDay();
    var weeks = [];
    var days;

    var months = [];
    var currentMonth = null;

    for (var i = 0; i < this.props.items.length + offset; i++) {
      if (i % 7 === 0) {
        days = [];
        weeks.push(days);
      }
      if (i < offset) {
        days.push(null);
      } else {
        var day = this.props.items[i - offset];
        var month = day[0].slice(5, 7);
        if (month !== currentMonth) {
          months.push([parseInt(month, 10) - 1, weeks.length - 1]);
          currentMonth = month;
        }
        days.push(day);
      }
    }

    return <PortraitContributions weeks={weeks} months={months} />;
  }
});

var Page = React.createClass({
  getInitialState: function () {
    return {
      contribs: [],
      isLoading: false
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
    xhr.open('GET', '/contributions/' + self.props.user);
    this.setState({ isLoading: true });
    xhr.send(null);
  },
  render: function () {
    return (
      <div>
        <h1>{this.props.user}'s contrib</h1>
        {this.state.isLoading ?
          <p key="loading">Loading</p> :
          <Contributions items={this.state.contribs} />
        }
      </div>
    );
  }
});

React.renderComponent(
  <Page user="shuhei" />,
  document.getElementById('page')
);
