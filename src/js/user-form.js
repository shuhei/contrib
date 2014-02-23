/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var UserForm = React.createClass({
  getInitialState: function () {
    return { user: null };
  },
  handleChange: function (event) {
    this.setState({ user: event.target.value });
  },
  handleClick: function (event) {
    this.props.onSubmit(this.state.user);
  },
  handleKeyDown: function (event) {
    // If ENTER
    if (event.keyCode === 13) {
      this.props.onSubmit(this.state.user);
    }
  },
  render: function () {
    return (
      <div className="user-form">
        <header>
          <h1>Contrib</h1>
        </header>
        <p>Input GitHub user name</p>
        <input type="text" value={this.state.user} onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
        <button onClick={this.handleClick}>OK</button>
      </div>
    );
  }
});

module.exports = UserForm;
