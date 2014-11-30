var React = require('react');
var {Navigation, RouteHandler} = require('react-router');
var Input = require('./input');

module.exports = React.createClass({
  submitHandler() {
    this.transitionTo('search', {query: this.refs.query.state.selected.map(function(option) {
      return option.id;
    }).join(';')});
  },
  mixins: [Navigation],
  render() {
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-brand" style={{float:"left"}}><a href="/">Phenontologic Search</a></div>
            <div className="navbar-header">
              <form onSubmit={this.submitHandler} className="navbar-form navbar-left" role="search">
                <Input ref="query"/>
                <select className="form-control" ref="metric" style={{marginRight:"10px"}}>
                  <option>SimUI</option>
                </select>
                <input className="btn btn-default btn-primary" type="submit" value="Search" />
              </form>
            </div>
          </div>
        </nav>
        <RouteHandler {...this.props} />
      </div>
    );
  },
});
