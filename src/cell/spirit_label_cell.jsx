import React from 'react';
import PropTypes from 'prop-types';

import {spirit as spiritText} from '../../data/text_ja.json';


const labelStyle = {
  margin: '10px',
};

const SpiritLabelCell = function(props) {
  return (
    <td>
      <div style={{
        float: 'left',
        height: props.height,
        width: props.width,
      }}
      />
      <span style={labelStyle}>
        {spiritText[props.label]}
      </span>
    </td>
  );
};

SpiritLabelCell.propTypes = {
  label: PropTypes.oneOf(Object.keys(spiritText)).isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
};

SpiritLabelCell.defaultProps = {
  height: 20,
  width: 20,
};

export default SpiritLabelCell;
