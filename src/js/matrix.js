/** @jsx React.DOM */

'use strict';

var React = require('react');
var Color = require('./color');
var Month = require('./month');

var PortraitMatrix = React.createClass({
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

var Matrix = React.createClass({
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

    return <PortraitMatrix weeks={weeks} months={months} />;
  }
});

module.exports = Matrix;
