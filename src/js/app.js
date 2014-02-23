/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var UserForm = require('./user-form');
var Contributions = require('./contributions');

var App = React.createClass({
  getInitialState: function () {
    return { user: window.localStorage.getItem('githubUser') };
  },
  handleCancel: function () {
    window.localStorage.removeItem('githubUser');
    window.localStorage.removeItem('contribs');
    this.setState({ user: null });
  },
  handleSubmit: function (user) {
    if (typeof user === 'string') {
      window.localStorage.setItem('githubUser', user);
      this.setState({ user: user });
    }
  },
  render: function () {
    return this.state.user ?
      <Contributions user={this.state.user} onCancel={this.handleCancel} /> :
      <UserForm onSubmit={this.handleSubmit} />;
  }
});

React.initializeTouchEvents(true);

React.renderComponent(
  <App />,
  document.getElementById('page')
);
