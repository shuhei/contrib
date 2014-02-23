/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var Color = require('./color');
var Month = require('./month');

// Rectangle to represent a day of contributions.
var Day = React.createClass({
  handleClick: function (e) {
    this.props.clickHandler(this.props.date, e);
  },
  render: function () {
    var props = {
      width: this.props.size,
      height: this.props.size,
      x: this.props.x,
      y: 0,
      style: { fill: Color.forCount(this.props.count) },
      key: this.props.date
    };
    // HACK: Use onTouchStart for mobile devices. onClick may have 300ms delay on them.
    var eventName = window.document.ontouchstart ? 'onTouchStart' : 'onClick';
    props[eventName] = this.handleClick;
    return React.DOM.rect(props);
  }
});

// The actual matrix chart.
var PortraitMatrix = React.createClass({
  size: 20,
  margin: 6,
  unit: function () {
    return this.size + this.margin;
  },
  // Rows of weeks
  weekGroups: function () {
    var self = this;
    return this.props.weeks.reverse().map(function (week, i) {
      var offset = 7 - week.length;
      var rects = week.reverse().map(function (day, j) {
        if (day == null) return null;
        var x = (j + offset) * self.unit();
        return <Day size={self.size}
                    x={x} date={day[0]}
                    count={day[1]}
                    clickHandler={self.handleClick} />;
      }).filter(Boolean);
      var transform = 'translate(0,' + i * self.unit() + ')';
      var key = 'week-' + i;
      return <g transform={transform} key={key}>{rects}</g>;
    });
  },
  // Months
  monthTextGroup: function () {
    var self = this;
    var texts = self.props.months.map(function (month, i) {
      var y = (self.props.weeks.length - 1 - month[1] - 1) * self.unit() + self.size / 2 + 5;
      var key = 'month-' + i;
      return <text x="0" y={y} key={key} className="month">{Month.forIndex(month[0])}</text>;
    });
    var transform = 'translate(' + self.unit() * 7 + ',0)';
    return <g transform={transform} key="months">{texts}</g>;
  },
  handleClick: function (date, e) {
    this.props.clickHandler(date, e);
  },
  render: function () {
    var groups = this.weekGroups();
    groups.push(this.monthTextGroup());

    var width = 7 * this.size + 6 * this.margin + 30 * 2;
    var height = 53 * this.unit();
    return (
      <svg width={width} height={height} className="matrix">
        <g transform="translate(30,0)">{groups}</g>
      </svg>
    );
  }
});

// Popup to show daily contributions.
var Popup = React.createClass({
  render: function () {
    var style = {
      top: this.props.y - 60,
      left: this.props.x - 75
    };
    var unit = this.props.count > 1 ? 'contributions' : 'contribution';
    return <div style={style} className="popup">
      {this.props.date}
      <br />
      {this.props.count} {unit}
    </div>;
  }
});

var Matrix = React.createClass({
  getInitialState: function () {
    return { selected: undefined };
  },
  // Handle click on a day rect and show popup for it.
  handleClick: function (date, e) {
    var self = this;

    // http://stackoverflow.com/questions/5834298/getting-the-screen-pixel-coordinates-of-a-rect-element
    var rect = e.target;
    var svg = rect.ownerSVGElement;
    var p = svg.createSVGPoint();
    p.x = rect.x.animVal.value + rect.width.animVal.value / 2;
    p.y = rect.y.animVal.value;
    var matrix = rect.getScreenCTM();
    var screenPoint = p.matrixTransform(matrix);
    var selected = {
      date: date,
      x: screenPoint.x,
      y: screenPoint.y + window.scrollY
    };

    // TODO: Create a util module to mock this.
    // Mobile Safari seems to include scrollY in clientTop.
    if (/webkit.*mobile/i.test(window.navigator.userAgent)) {
      // HACK: Not sure why but mobile Safari positions the popup 5px belower.
      selected.y = screenPoint.y - 5;
    }

    setTimeout(function () {
      if (self.state.selected === selected) {
        self.setState({ selected: undefined });
      }
    }, 3000);

    self.setState({ selected: selected });
  },
  renderPopup: function () {
    var items = [];

    if (this.state.selected) {
      var x = this.state.selected.x;
      var y = this.state.selected.y;
      var date = this.state.selected.date;
      var count = this.props.items.filter(function (day) {
        return day[0] === date;
      })[0][1];
      items.push(<Popup x={x} y={y} date={date} count={count} key='popup' />);
    }

    return <CSSTransitionGroup component={React.DOM.div} transitionName="popup">
      {items}
    </CSSTransitionGroup>;
  },
  renderMatrix: function () {
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

    return <PortraitMatrix weeks={weeks} months={months} clickHandler={this.handleClick} />;
  },
  render: function () {
    if (this.props.items.length === 0) {
      return <p>No Data</p>;
    }

    return <div>
      {this.renderPopup()}
      {this.renderMatrix()}
    </div>;
  }
});

module.exports = Matrix;
