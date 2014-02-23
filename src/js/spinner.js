/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var Spinner = React.createClass({
  render: function () {
    if (this.props.isActive) {
      return <div className="spinner">
        <div className="double-bounce1" />
        <div className="double-bounce2" />
      </div>;
    } else {
      return <div />
    }
  }
});

module.exports = Spinner;
