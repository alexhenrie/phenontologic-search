var React = require('react');
var request = require('superagent');

module.exports = React.createClass({
  getInitialState() {
    return {loading: false, results: []};
  },
  getResults() {
    this.setState({loading: true});
    this.startTime = Date.now();
    request.get('/api/people?query=' + this.props.query + '&metric=' + this.props.metric, (error, result) => {
      if (error) {
        return;
      }
      this.setState({loading: false, results: result.body});
    });
  },
  componentDidMount() {
    this.getResults();
  },
  componentWillReceiveProps() {
    this.getResults();
  },
  render() {
    if (this.state.loading) {
      return (
        <div style={{textAlign:'center'}}>
          {/* https://genomevolution.org/wiki/images/d/df/DNA_orbit_animated_small-side.gif */}
          {/* https://commons.wikimedia.org/wiki/File:DNA_orbit_animated_small.gif */}
          <img alt="Loading..." src="/DNA_orbit_animated_small-side.gif"/>
        </div>
      );
    }
    var resultDivs = this.state.results.map(function(result) {
      return (
        <tr key={result.name}>
          <td>
            <div style={{fontSize:'larger'}}>{result.name}</div>
            {result.characteristics.map(function(characteristic) {
              return <span className="label label-primary" style={{display:'inline-block',fontSize:'small',margin:'3px'}}>{characteristic}</span>
            })}
          </td>
          <td>{result.value.toFixed(3)}</td>
        </tr>
      );
    })
    return (
      <div>
        <div style={{fontWeight:'bold', textAlign:'right'}}>Search completed in {((Date.now() - this.startTime) / 1000).toFixed(2)} seconds.</div>
        <table className="table table-hover table-striped"><tbody>{resultDivs}</tbody></table>
      </div>
    );
  }
});
