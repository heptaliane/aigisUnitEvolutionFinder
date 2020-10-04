import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

import common from './aigis_common.js';


const containerStyle = {
  margin: '10px',
};

class LevelSelection extends React.Component {

  static getDerivedStateFromProps(props) {
    return props;
  }

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
    const idx = common.level.label.indexOf(target.value);
    this.callback(idx);
    this.setState({active: idx});
  }

  render() {
    return (
      <div style={containerStyle}>
        <Form.Control
          as="select"
          value={common.level.label[this.state.active]}
          onChange={this.handleChange}
        >
          {common.level.label.map((lbl, idx) => {
            if (common.hasItem(this.state.implemented, idx)) {
              return (
                <option
                  key={lbl}
                >
                  {lbl}
                </option>
              );
            }
          })}
        </Form.Control>
      </div>
    );
  }

}

LevelSelection.propTypes = {
  active: PropTypes.oneOf(common.level.keys),
  implemented: PropTypes.arrayOf(PropTypes.oneOf(common.level.keys)),
  onChange: PropTypes.func,
};

LevelSelection.defaultProps = {
  active: common.default.level,
  implemented: [],
  onChange: common.default.handler,
};

export default LevelSelection;
