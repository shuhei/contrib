/** @jsx React.DOM */

'use strict';

var React = require('react');
var Matrix = require('./matrix');

var Loading = React.createClass({
  render: function () {
    if (this.props.isLoading) {
      return <div className="spinner">
        <div className="double-bounce1" />
        <div className="double-bounce2" />
      </div>;
    } else {
      return <div />
    }
  }
});

var StatsItem = React.createClass({
  render: function () {
    return <div className="stats-item">
      <span className="stats-num">{this.props.value}</span>
      <br />
      <span className="stats-unit">{this.props.unit}</span>
    </div>;
  }
});

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
  totalContibutions: function () {
    return this.state.contribs.reduce(function (acc, day) {
      return acc + day[1];
    }, 0);
  },
  currentStreak: function () {
    var reversed = this.state.contribs.slice().reverse();
    return reversed.reduce(function (acc, day) {
      var done = acc[1] || day[1] <= 0;
      var newCount = acc[0] + (done ? 0 : 1);
      return [newCount, done];
    }, [0, false])[0];
  },
  render: function () {
    var total = this.totalContibutions();
    var current = this.currentStreak();
    return (
      <div className="contributions">
        <header>
          <Loading isLoading={this.state.isLoading} />
          <h1>{this.props.user}</h1>
          <button className="cancel" onClick={this.props.onCancel}>&times;</button>
        </header>
        <div className="stats">
          <StatsItem value={current} unit="Days" />
          <StatsItem value={total} unit="Total" />
        </div>
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

React.renderComponent(
  <Page />,
  document.getElementById('page')
);
