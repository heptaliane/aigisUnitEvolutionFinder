import React from 'react';
import PropTypes from 'prop-types';
import InputGroup from 'react-bootstrap/InputGroup';
import {Typeahead} from 'react-bootstrap-typeahead';
import SearchIcon from 'bootstrap-icons/icons/search.svg';

import 'react-bootstrap-typeahead/css/Typeahead.css';

import {search as searchText} from '../data/text_ja.json';


class SelectableInput extends React.Component {

  constructor(props) {
    super(props);

    this.lut = props.selections;
    this.callback = props.onSelect;
    this.filter = null;

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
  }

  handleClick(selections) {
    if (selections.length > 0) {
      this.callback(selections[0]);
    }
  }

  handleChange() {
    this.filter = null;
  }

  applyFilter(option, {text}) {
    if (this.filter === null) {
      this.filter = new RegExp(text);
    }

    if (this.filter.test(this.lut[option])) {
      return true;
    }
    return this.filter.test(option);
  }

  render() {
    return (
      <div>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>
              <SearchIcon />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Typeahead
            emptyLabel={searchText.emptyLabel}
            filterBy={this.applyFilter}
            id="search"
            labelKey="name"
            options={Object.keys(this.lut)}
            placeholder={searchText.placeholder}
            onChange={this.handleClick}
            onInputChange={this.handleChange}
          />
        </InputGroup>
      </div>
    );
  }

}

SelectableInput.defaultProps = {
  onSelect: (args) => {
    return console.log(args);
  },
};

SelectableInput.propTypes = {
  // {text: ruby}
  selections: PropTypes.objectOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func,
};

export default SelectableInput;
