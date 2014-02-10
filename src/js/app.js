/** @jsx React.DOM */

'use strict';

var React = require('react');
var Matrix = require('./matrix');

var Contributions = React.createClass({
  getInitialState: function () {
    var contribs = JSON.parse(window.localStorage.getItem('contribs') || '[]');
    return {
      contribs: contribs,
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
        window.localStorage.setItem('contribs', xhr.responseText);
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
      <div className="contributions">
        <header>
          <h1>{this.props.user}</h1>
          <button className="cancel" onClick={this.props.onCancel}>&times;</button>
        </header>
        {this.state.isLoading ? <p key="loading" className="loading">Loading</p> : ''}
        {this.state.contribs.length > 0 ? <Matrix items={this.state.contribs} /> : ''}
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

var Page = React.createClass({
  getInitialState: function () {
    return { user: window.localStorage.getItem('githubUser') };
  },
  handleCancel: function () {
    delete window.localStorage.getItem('githubUser');
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

React.renderComponent(
  <Page />,
  document.getElementById('page')
);
