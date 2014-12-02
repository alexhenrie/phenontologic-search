var React = require('react');
var TokenInput = require('react-tokeninput');
var ComboboxOption = TokenInput.Option;
var debounce = require('lodash-node/modern/functions/debounce');
var request = require('superagent');
var uniq = require('lodash-node/modern/arrays/uniq');
var without = require('lodash-node/modern/arrays/without');

module.exports = React.createClass({
  componentDidMount() {
    if (this.props.defaultValue) {
      this.props.defaultValue.split(';').forEach((term) => {
        request.get('/api/term?query=' + term, (error, result) => {
          if (error)
            return;

          if (!result.body)
            return;

          result.body.name += ' [' + result.body.id + ']';
          this.handleSelect(result.body);
        });
      });
    }
    this.debouncedSearch = debounce(this.search, 300);
  },
  getInitialState() {
    return {
      selected: [],
      options: [],
    };
  },
  handleChange(value) {
    this.setState({
      selected: value
    });
  },
  handleInput(userInput) {
    this.debouncedSearch(userInput);
  },
  handleSelect(value, combobox) {
    if (!value.id || !value.name)
      return;

    this.setState({
      selected: this.state.selected.concat([value]),
    });
  },
  handleRemove(value) {
    this.setState({
      selected: without(this.state.selected, value),
    });
  },
  render() {
    return (
      <div>
      <TokenInput
         onChange={this.handleChange}
         onInput={this.handleInput}
         onSelect={this.handleSelect}
         onRemove={this.handleRemove}
         selected={this.state.selected}
         menuContent={this.renderComboboxOptions()}
      />
      </div>
    );
  },
  renderComboboxOptions() {
    return this.state.options.map(function(flavor) {
      return (
        <ComboboxOption key={flavor.id} value={flavor}>{flavor.name}</ComboboxOption>
      );
    });
  },
  search(userInput) {
    if (!userInput)
      return;

    request.get('/api/terms?query=' + userInput, (error, result) => {
      if (error) {
        return;
      }
      var selectedOptions = this.state.selected;
      this.setState({
        options: result.body.filter(function(term) {
          for (var i = 0; i < selectedOptions.length; i++) {
            if (term.name == selectedOptions[i].name) {
              return false;
            }
          }
          return true;
        }).map(function(term) {
          term.name += ' [' + term.id + ']';
          return term;
        }),
      });
    });
  }
});
