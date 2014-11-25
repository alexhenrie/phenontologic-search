var React = require('react');
var request = require('superagent');

module.exports = React.createClass({
  getInitialState() {
    return {loading: false, results: []};
  },
  getResults() {
    this.setState({loading: true});
    request.get('/api/people?q=' + this.props.query, (error, result) => {
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
        <div style={{textAlign:"center"}}>
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
            {result.name} {result.value}<br/>
            Phenotype list goes here
          </td>
        </tr>
      );
    })
    return (
      <table className="table table-hover table-striped"><tbody>{resultDivs}</tbody></table>
    );
  }
});
