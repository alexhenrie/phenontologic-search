var React = require('react');
var {Navigation, RouteHandler} = require('react-router');
var Input = require('./input');

module.exports = React.createClass({
  submitHandler() {
    this.transitionTo('search', {
      metric: this.refs.metric.getDOMNode().value,
      query: this.refs.query.state.selected.map(function(option) {
        return option.id;
      }).join(';'),
    });
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
                <Input ref="query" defaultValue={this.props.query}/>
                <select className="form-control" ref="metric" style={{marginRight:'10px'}} defaultValue={this.props.metric||'simui'}>
                  <option value="ali">Ali 2009</option>
                  <option value="bader">Bader 2003</option>
                  <option value="blanquet">Braun Blanquet 1932</option>
                  <option value="dice">Dice 1935</option>
                  <option value="knappe">Knappe 2004</option>
                  <option value="korbel">Korbel 2002</option>
                  <option value="lee">Lee 2004</option>
                  <option value="maryland">Maryland Bridge 2003</option>
                  <option value="nto">Normalized Term Overlap</option>
                  <option value="nto_max">Normalized (Max) Term Overlap</option>
                  <option value="ochiai">Ochiai 1957</option>
                  <option value="simlp">SimLP</option>
                  <option value="simpson">Simpson 1960</option>
                  <option value="simui">SimUI</option>
                  <option value="sokal">Sokal &amp; Sneath 1963</option>
                  <option value="to">Term Overlap</option>
                  <option value="tversky">Tversky 1977 Abstract Model</option>
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
