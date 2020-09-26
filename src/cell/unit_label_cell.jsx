import React from 'react';
import PropTypes from 'prop-types';

import ClassIcon from '../class_icon.jsx';
import {base_label as blbls} from '../../data/jobs.json';


const labelStyle = {
  margin: '10px',
};

const UnitLabelCell = function(props) {
  return (
    <td>
      {React.createElement(ClassIcon[props.classId], {
        height: props.height,
        width: props.width,
      }, null)}
      <span style={labelStyle}>
        {blbls[props.classId]}
      </span>
    </td>
  );
};

UnitLabelCell.propTypes = {
  classId: PropTypes.oneOf(Object.keys(ClassIcon)).isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
};

UnitLabelCell.defaultProps = {
  height: 20,
  width: 20,
};

export default UnitLabelCell;
