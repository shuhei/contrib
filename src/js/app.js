/** @jsx React.DOM */

'use strict';

var React = require('react');
var Matrix = require('./matrix');

var Contributions = React.createClass({
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
        <h1>{this.props.user} <button onClick={this.props.onCancel}>&times;</button></h1>
        {this.state.isLoading ?
          <p key="loading">Loading</p> :
          <Matrix items={this.state.contribs} />
        }
      </div>
    );
  }
});

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
        <p>Input GitHub user name</p>
        <input type="text" value={this.state.user} onChange={this.handleChange} onKeyDown={this.handleKeyDown} />
        <button onClick={this.handleClick}>OK</button>
      </div>
    );
  }
});

var Page = React.createClass({
  getInitialState: function () {
    return { user: window.localStorage['githubUser'] };
  },
  handleCancel: function () {
    delete window.localStorage['githubUser'];
    this.setState({ user: null });
  },
  handleSubmit: function (user) {
    window.localStorage['githubUser'] = user;
    this.setState({ user: user });
  },
  render: function () {
    return this.state.user ?
      <Contributions user={this.state.user} onCancel={this.handleCancel.bind(this)} /> :
      <UserForm onSubmit={this.handleSubmit.bind(this)} />;
  }
});

React.renderComponent(
  <Page />,
  document.getElementById('page')
);
