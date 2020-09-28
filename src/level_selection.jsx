import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

import {header as headerText} from '../data/text_ja.json';


const notFound = -1;

const containerStyle = {
  margin: '10px',
};

const disabledItemStyle = {
  color: '#495057',
  background: '#e9ecef',
};

class LevelSelection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      implemented: props.implemented,
      active: props.active,
    };
    this.callback = props.onChange;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({target}) {
    const idx = headerText.level.indexOf(target.value);
    this.callback(idx);
    this.setState({active: idx});
  }

  render() {
    return (
      <div style={containerStyle}>
        <Form.Control
          as="select"
          value={headerText.level[this.state.active]}
          onChange={this.handleChange}
        >
          {headerText.level.map((lbl, idx) => {
            return (
              <option
                key={lbl}
                disabled={this.state.implemented.indexOf(idx) === notFound}
                style={this.state.implemented.indexOf(idx) === notFound ?
                  disabledItemStyle :
                  {}
                }
              >
                {lbl}
              </option>
            );
          })}
        </Form.Control>
      </div>
    );
  }

}

LevelSelection.propTypes = {
  active: PropTypes.oneOf(Array.from({
    length: headerText.level.length,
  }, (_, i) => {
    return i;
  })),
  implemented: PropTypes.arrayOf(PropTypes.oneOf(Array.from({
    length: headerText.level.length,
  }, (_, i) => {
    return i;
  }))),
  onChange: PropTypes.func,
};

LevelSelection.defaultProps = {
  active: 0,
  implemented: [],
  onChange: (args) => {
    console.log(args);
  },
};

export default LevelSelection;
