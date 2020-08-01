import React from 'react';
import PropTypes from 'prop-types';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Navbar from 'react-bootstrap/Navbar';
import HouseIcon from 'bootstrap-icons/icons/house-fill.svg';

import SelectionInput from './selection_input.jsx';
import {header as headerText} from '../data/text_ja.json';

const notFound = -1;


class ContentHeader extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      level: String(props.level),
      label: props.label,
      implLevels: props.implLevels,
    };
    this.href = props.href;
    this.selections = props.selections;
    this.callbackSelect = props.onSelect;
    this.callbackSearch = props.onSearch;

    this.handleSelect = this.handleSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSelect({target}) {
    this.callbackSelect(Number(target.value));
    this.setState({level: target.value});
  }

  handleSearch(value) {
    this.callbackSearch(value);
  }

  render() {
    return (
      <Navbar
        bg="dark"
        expand="lg"
        variant="dark"
      >
        <Navbar.Brand href={this.href}>
          <HouseIcon />
        </Navbar.Brand>
        <Navbar.Brand>
          {this.state.label}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="header-collapse" />
        <Navbar.Collapse id="header-collapse">
          <div
            className="ml-auto"
            style={{
              textAlign: 'center',
              marginTop: '10px',
              marginBottom: '10px',
              minWidth: '420px',
            }}
          >
            <ButtonGroup
              style={{width: '90%'}}
              toggle={true}
            >
              {
                headerText.level.map((v, i) => {
                  return (
                    <ToggleButton
                      key={`level-${i}`}
                      checked={this.state.level === String(i)}
                      disabled={this.state.implLevels.indexOf(i) === notFound}
                      type="radio"
                      value={String(i)}
                      variant={
                        this.state.implLevels.indexOf(i) === notFound ?
                          'secondary' :
                          'primary'
                      }
                      onChange={this.handleSelect}
                    >
                      {v}
                    </ToggleButton>
                  );
                })
              }
            </ButtonGroup>
          </div>
          <SelectionInput
            selections={this.selections}
            onSelect={this.handleSearch}
          />
        </Navbar.Collapse>
      </Navbar>
    );
  }

}

ContentHeader.propTypes = {
  selections: PropTypes.objectOf(PropTypes.string).isRequired,
  href: PropTypes.string,
  implLevels: PropTypes.arrayOf(PropTypes.oneOf(headerText.level.map((_, i) => {
    return i;
  }))),
  label: PropTypes.string,
  level: PropTypes.number,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
};

ContentHeader.defaultProps = {
  href: '#',
  implLevels: [],
  label: '',
  level: 1,
  onSelect: (args) => {
    return console.log(args);
  },
  onSearch: (args) => {
    return console.log(args);
  },
};

export default ContentHeader;
