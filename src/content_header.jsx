import React from 'react';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/Navbar';
import HouseIcon from 'bootstrap-icons/icons/house-fill.svg';

import SelectionInput from './selection_input.jsx';
import RaritySelection from './rarity_selection.jsx';
import LevelSelection from './level_selection.jsx';
import rarityData from '../data/rarity.json';
import {header as headerText} from '../data/text_ja.json';


const middleComponentStyle = {
  display: 'grid',
  textAlign: 'center',
  minWidth: '420px',
  gridTemplateColumns: '1fr 1fr',
};

const componentStyle = {
  margin: '10px',
};

class ContentHeader extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      level: props.level,
      label: props.label,
      rarity: props.rarity,
      implLevels: props.implLevels,
    };
    this.href = props.href;
    this.selections = props.selections;
    this.callback = props.onChange;

    this.handleLevelChange = this.handleLevelChange.bind(this);
    this.handleRarityChange = this.handleRarityChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleLevelChange(level) {
    this.callback({level: level});
    this.setState({level: level});
  }

  handleSearch(value) {
    this.callback(value);
  }

  handleRarityChange(rarity) {
    this.callback({rarity: rarity});
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
            style={middleComponentStyle}
          >
            <LevelSelection
              active={this.state.level}
              implemented={this.state.implLevels}
              onChange={this.handleLevelChange}
            />
            <RaritySelection
              active={this.state.rarity}
              onChange={this.handleRarityChange}
            />
          </div>
          <div style={componentStyle}>
            <SelectionInput
              selections={this.selections}
              onSelect={this.handleSearch}
            />
          </div>
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
  rarity: PropTypes.oneOf(Object.keys(rarityData)),
  onChange: PropTypes.func,
};

ContentHeader.defaultProps = {
  href: '#',
  implLevels: [],
  label: '',
  level: 1,
  rarity: 'black',
  onChange: (args) => {
    return console.log(args);
  },
};

export default ContentHeader;
