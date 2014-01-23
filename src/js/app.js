/** @jsx React.DOM */

'use strict';

var Page = React.createClass({
  componentDidMount: function () {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      console.log(arguments);
    };
    xhr.open('GET', '/contributions/shuhei');
    xhr.send(null);
  },
  render: function () {
    return (
      <div>
        <h1>{this.props.title}</h1>
      </div>
    );
  }
});

React.renderComponent(
  <Page title="Hello, World!" />,
  document.getElementById('page')
);
