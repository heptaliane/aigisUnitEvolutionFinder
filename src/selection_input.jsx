import React from 'react';
import PropTypes from 'prop-types';
import InputGroup from 'react-bootstrap/InputGroup';
import {Typeahead} from 'react-bootstrap-typeahead';
import SearchIcon from 'bootstrap-icons/icons/search.svg';

import 'react-bootstrap-typeahead/css/Typeahead.css';

import common from './aigis_common.js';


class SelectableInput extends React.Component {

  constructor(props) {
    super(props);

    this.lut = props.selections;
    this.callback = props.onSelect;
    this.filter = null;
    this.shouldClear = false;

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.setReferenceInput = this.setReferenceInput.bind(this);
  }

  handleClick(selections) {
    if (selections.length > 0) {
      this.callback(selections[0]);
      this.shouldClear = true;
    }
  }

  handleChange() {
    this.filter = null;
  }

  handleFocus() {
    if (this.shouldClear) {
      this.input.clear();
      this.shouldClear = false;
    }
  }

  setReferenceInput(ref) {
    this.input = ref;
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
            ref={this.setReferenceInput}
            emptyLabel={common.text.search.emptyLabel}
            filterBy={this.applyFilter}
            id="search"
            labelKey="name"
            options={Object.keys(this.lut)}
            paginationText={common.text.search.pagination}
            placeholder={common.text.search.placeholder}
            onChange={this.handleClick}
            onFocus={this.handleFocus}
            onInputChange={this.handleChange}
            onKeyDown={this.handleFocus}
          />
        </InputGroup>
      </div>
    );
  }

}

SelectableInput.propTypes = {
  // {text: ruby}
  selections: PropTypes.objectOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func,
};

SelectableInput.defaultProps = {
  onSelect: common.default.handler,
};

export default SelectableInput;
