import React from 'react';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import HouseIcon from 'bootstrap-icons/icons/house-fill.svg';
import RightArrowIcon from 'bootstrap-icons/icons/caret-right-fill.svg';

import SelectionInput from './selection_input.jsx';
import RaritySelection from './rarity_selection.jsx';
import LevelSelection from './level_selection.jsx';
import common from './aigis_common.js';


const implementedLevel = common.unitClass.implementedLevel;

const middleComponentStyle = {
  display: 'grid',
  textAlign: 'center',
  minWidth: '420px',
  gridTemplateColumns: '1fr 1fr',
};

const componentStyle = {
  margin: '10px',
};

const homeStyle = {
  cursor: 'pointer',
  padding: '10px',
};

const textAreaStyle = {
  padding: '10px',
};

const arrowStyle = {
  marginLeft: '5px',
  marginRight: '5px',
};

const badgeStyle = {
  margin: '5px',
};

class ContentHeader extends React.Component {

  static getDerivedStateFromProps(props) {
    return props;
  }

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
    const {classId, level} = common.unitClass.ruby.lut[label];
    const isValidLevel = common.hasItem(implementedLevel, level);
    const newLevel = common.hasItem(common.level.keys, level) && isValidLevel ?
      level :
      common.default.level;

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
        <Navbar.Brand
          style={homeStyle}
          onClick={this.handleReset}
        >
          <HouseIcon />
        </Navbar.Brand>
        <Navbar.Brand>
          {
            this.state.classId === null ?
              '' :
              `${common.unitClass.baseLabel[this.state.classId]}`
          }
        </Navbar.Brand>
        <Navbar.Text style={textAreaStyle}>
          {
            this.state.classId === null ?
              '' :

              <div>
                <Badge
                  style={badgeStyle}
                  variant="primary"
                >
                  {
                    common.getClassLabelWithLevel(
                      this.state.classId,
                      this.state.level
                    )
                  }
                </Badge>
                <RightArrowIcon
                  height="1.5em"
                  style={arrowStyle}
                  width="1.5em"
                />
                {
                  common.getClassLabelWithLevel(
                    this.state.classId,
                    this.state.level + 1
                  ).map((label) => {
                    return (
                      <Badge
                        key={label}
                        style={badgeStyle}
                        variant="primary"
                      >
                        {label}
                      </Badge>
                    );
                  })}
              </div>
          }
        </Navbar.Text>
        <Navbar.Toggle aria-controls="header-collapse" />
        <Navbar.Collapse id="header-collapse">
          <div
            className="ml-auto"
            style={middleComponentStyle}
          >
            <LevelSelection
              active={this.state.level}
              implemented={implementedLevel[this.state.classId]}
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
              selections={common.unitClass.ruby.selection}
              onSelect={this.handleIdChange}
            />
          </div>
        </Navbar.Collapse>
      </Navbar>
    );
  }

}

ContentHeader.propTypes = {
  classId: PropTypes.oneOf(common.unitClass.classId),
  level: PropTypes.number,
  rarity: PropTypes.oneOf(common.rarity.keys),
  onChange: PropTypes.func,
};

ContentHeader.defaultProps = {
  classId: common.default.classId,
  level: common.default.level,
  rarity: common.default.rarity,
  onChange: common.default.handler,
};

export default ContentHeader;
