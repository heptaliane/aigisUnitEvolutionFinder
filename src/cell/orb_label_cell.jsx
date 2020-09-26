import React from 'react';
import PropTypes from 'prop-types';

import ClassIcon from '../class_icon.jsx';
import {label as jobs} from '../../data/jobs.json';
import {table as tableText} from '../../data/text_ja.json';

const OrbLabelCell = function(props) {
  const ccLbl = jobs[props.classId][1].label;
  return (
    <td>
      {React.createElement(ClassIcon[props.classId], {
        height: props.height,
        width: props.width,
      }, null)}
      {`${ccLbl}${tableText.orb}`}
    </td>
  );
};

OrbLabelCell.propTypes = {
  classId: PropTypes.oneOf(Object.keys(ClassIcon)).isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
};

OrbLabelCell.defaultProps = {
  height: 20,
  width: 20,
};

export default OrbLabelCell;
