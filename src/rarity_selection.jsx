import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

import rarityData from '../data/rarity.json';


const rarity = Object.keys(rarityData);

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
            return (
              <option
                key={lbl}
                style={rarityData[lbl].style}
              >
                {lbl.toUpperCase()}
              </option>
            );
          })}
        </Form.Control>
      </div>
    );
  }

}

RaritySelection.propTypes = {
  active: PropTypes.oneOf(rarity),
  onChange: PropTypes.func,
};

RaritySelection.defaultProps = {
  active: rarity[rarity.length - 1],
  onChange: (args) => {
    console.log(args);
  },
};

export default RaritySelection;
