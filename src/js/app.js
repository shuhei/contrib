/** @jsx React.DOM */

'use strict';

var Contributions = React.createClass({
  render: function () {
    console.log();
    var items = this.props.contribs.map(function (date) {
      return <li>{date[0]}: {date[1]}</li>;
    });
    return (
      <ul>{items}</ul>
    );
  }
});

var Page = React.createClass({
  getInitialState: function () {
    return {
      contribs: [],
      loading: false
    };
  },
  componentDidMount: function () {
    var self = this;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        self.setState({
          loading: false,
          contribs: JSON.parse(xhr.responseText)
        });
      } else {
        self.setState({ loading: false });
        console.log('Something went wrong.', xhr.status);
      }
    };
    xhr.open('GET', '/contributions/shuhei');
    this.setState({ loading: true });
    xhr.send(null);
  },
  render: function () {
    return (
      <div>
        <h1>{this.props.title}</h1>
        {this.state.loading ?
          <p>Loading</p> :
          <Contributions contribs={this.state.contribs} />
        }
      </div>
    );
  }
});

React.renderComponent(
  <Page title="Github Contributions" />,
  document.getElementById('page')
);
