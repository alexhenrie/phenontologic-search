var React = require('react');
var {Navigation, RouteHandler} = require('react-router');

module.exports = React.createClass({
  submitHandler() {
    var query = this.refs.query.getDOMNode().value;
    this.transitionTo('search', {query});
  },
  mixins: [Navigation],
  render() {
    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-brand" style={{float:"left"}}>Phenontologic Search</div>
            <div className="navbar-header">
              <form onSubmit={this.submitHandler} className="navbar-form navbar-left" role="search">
                <input className="form-control" ref="query" type="text" defaultValue={this.props.query} style={{width:"600px", marginRight:"10px"}} />
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
