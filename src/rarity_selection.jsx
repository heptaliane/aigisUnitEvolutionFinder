import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

import rarityData from '../data/rarity.json';


const rarity = Object.keys(rarityData);
const ccLevel = 0;

const containerStyle = {
  margin: '10px',
};

const isAvailableLabel = function(lbl, level) {
  if (level === ccLevel) {
    return rarityData[lbl].cc !== null;
  }
  return rarityData[lbl].orb !== null;
};

class RaritySelection extends React.Component {

  static getDerivedStateFromProps(props) {
    return props;
  }

  constructor(props) {
    super(props);

    this.state = {
      active: props.active,
      level: props.level,
    };
    this.callback = props.onChange;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({target}) {
    const value = target.value.toLowerCase();
    this.callback(value);
    this.setState({active: value});
  }

  render() {
    return (
      <div style={containerStyle}>
        <Form.Control
          as="select"
          style={rarityData[this.state.active].style}
          value={this.state.active.toUpperCase()}
          onChange={this.handleChange}
        >
          {rarity.map((lbl) => {
            if (isAvailableLabel(lbl, this.state.level)) {
              return (
                <option
                  key={lbl}
                  style={rarityData[lbl].style}
                >
                  {lbl.toUpperCase()}
                </option>
              );
            }
          })}
        </Form.Control>
      </div>
    );
  }

}

RaritySelection.propTypes = {
  active: PropTypes.oneOf(rarity),
  level: PropTypes.number,
  onChange: PropTypes.func,
};

RaritySelection.defaultProps = {
  active: rarity[rarity.length - 1],
  level: ccLevel,
  onChange: (args) => {
    console.log(args);
  },
};

export default RaritySelection;
