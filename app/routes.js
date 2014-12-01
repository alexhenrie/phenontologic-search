var Search = require('./components/search');
var React = require('react');
var {Route} = require('react-router');
var App = require('./components/app');

module.exports = (
  <Route handler={App} path="/">
    <Route name="search" path="/search/:query/:metric" handler={Search} />
  </Route>
);
