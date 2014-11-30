var React = require('react')
var routes = require('./routes')
var Router = require('react-router')

Router.run(routes, function(Handler, state) {
  React.render(<Handler {...state.params} />, document.getElementById('application'));
});
