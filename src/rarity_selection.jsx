import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

import common from './aigis_common.js';


const containerStyle = {
  margin: '10px',
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
          style={common.rarity.data[this.state.active].style}
          value={this.state.active.toUpperCase()}
          onChange={this.handleChange}
        >
          {common.rarity.keys.map((lbl) => {
            if (common.checkValidRarity(this.state.level, lbl)) {
              return (
                <option
                  key={lbl}
                  style={common.rarity.data[lbl].style}
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
  active: PropTypes.oneOf(common.rarity.keys),
  level: PropTypes.oneOf(common.level.keys),
  onChange: PropTypes.func,
};

RaritySelection.defaultProps = {
  active: common.rarity.keys[common.rarity.keys.length - 1],
  level: common.constant.ccLevel,
  onChange: common.default.handler,
};

export default RaritySelection;
