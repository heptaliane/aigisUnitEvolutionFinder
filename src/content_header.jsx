import React from 'react';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/Navbar';
import HouseIcon from 'bootstrap-icons/icons/house-fill.svg';

import SelectionInput from './selection_input.jsx';
import RaritySelection from './rarity_selection.jsx';
import LevelSelection from './level_selection.jsx';
import rarityData from '../data/rarity.json';
import {header as headerText} from '../data/text_ja.json';
import {
  ruby,
  base_label as blbl,
} from '../data/jobs.json';


const notFound = -1;
const numLevels = headerText.level.length;
const defaultLevel = 1;

const jobSelection = Object.keys(ruby).reduce((obj, k) => {
  obj[ruby[k].label] = k;
  return obj;
}, {});

const jobLut = Object.keys(ruby).reduce((obj, k) => {
  obj[ruby[k].label] = {
    level: ruby[k].level,
    classId: ruby[k].id,
  };
  return obj;
}, {});

const implData = Object.keys(jobLut).reduce((arr, k) => {
  const idx = jobLut[k].classId;
  if (arr[idx] === undefined) {
    arr[idx] = [];
  }
  if (jobLut[k].level > 0) {
    arr[idx].push(jobLut[k].level - 1);
  }
  return arr;
}, []);

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
      classId: props.classId,
      level: props.level,
      rarity: props.rarity,
    };
    this.callback = props.onChange;

    this.handleLevelChange = this.handleLevelChange.bind(this);
    this.handleRarityChange = this.handleRarityChange.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleLevelChange(level) {
    this.callback({level: level});
    this.setState({level: level});
  }

  handleRarityChange(rarity) {
    this.callback({rarity: rarity});
    this.setState({rarity: rarity});
  }

  handleIdChange(label) {
    const {classId, level} = jobLut[label];
    const isValidLevel = implData[classId].indexOf(level) !== notFound;
    const newLevel = level < numLevels && isValidLevel ?
      level :
      defaultLevel;

    this.setState({
      classId: classId,
      level: newLevel,
    });
    this.callback({
      classId: classId,
      level: newLevel,
    });
  }

  handleReset() {
    this.setState({classId: null});
    this.callback({classId: null});
  }

  render() {
    return (
      <Navbar
        bg="dark"
        expand="lg"
        variant="dark"
      >
        <Navbar.Brand onClick={this.handleReset}>
          <HouseIcon />
        </Navbar.Brand>
        <Navbar.Brand>
          {
            this.state.classId === null ?
              '' :
              blbl[this.state.classId]
          }
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="header-collapse" />
        <Navbar.Collapse id="header-collapse">
          <div
            className="ml-auto"
            style={middleComponentStyle}
          >
            <LevelSelection
              active={this.state.level}
              implemented={implData[this.state.classId]}
              onChange={this.handleLevelChange}
            />
            <RaritySelection
              active={this.state.rarity}
              level={this.state.level}
              onChange={this.handleRarityChange}
            />
          </div>
          <div style={componentStyle}>
            <SelectionInput
              selections={jobSelection}
              onSelect={this.handleIdChange}
            />
          </div>
        </Navbar.Collapse>
      </Navbar>
    );
  }

}

ContentHeader.propTypes = {
  classId: PropTypes.oneOf(Array.from({length: implData.length + 1}).
    map((_, i) => {
      return i < implData.length ?
        i :
        null;
    })),
  level: PropTypes.number,
  rarity: PropTypes.oneOf(Object.keys(rarityData)),
  onChange: PropTypes.func,
};

ContentHeader.defaultProps = {
  classId: null,
  level: defaultLevel,
  rarity: 'black',
  onChange: (args) => {
    return console.log(args);
  },
};

export default ContentHeader;
