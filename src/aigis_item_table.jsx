import React from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';

import ClassIcon from './class_icon.jsx';
import RarityCell from './cell/rarity_cell.jsx';
import UnitLabelCell from './cell/unit_label_cell.jsx';
import SpiritLabelCell from './cell/spirit_label_cell.jsx';
import OrbLabelCell from './cell/orb_label_cell.jsx';

import rarityData from '../data/rarity.json';
import {
  spirit as spiritText,
  table as tableText,
} from '../data/text_ja.json';


const iconSize = 25;

const spiritRarity = Object.keys(spiritText).reduce((obj, key) => {
  if (rarityData[key] === undefined) {
    obj[key] = 'black';
  } else {
    obj[key] = key;
  }
  return obj;
}, {});


class AigisItemTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      unit: props.unit,
      spirit: props.spirit,
      orb: props.orb,
    };
  }

  render() {
    return (
      <Table
        bordered={true}
        striped={true}
      >
        <thead>
          <tr>
            <th>
              {tableText.rarity}
            </th>
            <th>
              {tableText.class}
            </th>
            <th>
              {tableText.amount}
            </th>
          </tr>
        </thead>
        <tbody>
          {this.state.unit.map((_, i) => {
            return (
              <tr key={`row-unit-${i}`}>
                <RarityCell
                  key={`rarity-unit-${i}`}
                  rarity={this.state.unit[i].rarity}
                />
                <UnitLabelCell
                  key={`label-unit-${i}`}
                  classId={this.state.unit[i].classId}
                  height={iconSize}
                  width={iconSize}
                />
                <td key={`amount-unit-${i}`}>
                  {this.state.unit[i].amount}
                </td>
              </tr>
            );
          })}
          {this.state.spirit.map((_, i) => {
            return (
              <tr key={`row-spirit-${i}`}>
                <RarityCell
                  key={`rarity-spirit-${i}`}
                  rarity={spiritRarity[this.state.spirit[i].label]}
                />
                <SpiritLabelCell
                  key={`label-spirit-${i}`}
                  height={iconSize}
                  label={this.state.spirit[i].label}
                  width={iconSize}
                />
                <td key={`amount-spirit-${i}`}>
                  {this.state.spirit[i].amount}
                </td>
              </tr>
            );
          })}
          {this.state.orb.map((_, i) => {
            return (
              <tr key={`row-orb-${i}`}>
                <td key={`rarity-orb-${i}`} />
                <OrbLabelCell
                  key={`label-orb-${i}`}
                  classId={this.state.orb[i].classId}
                  height={iconSize}
                  width={iconSize}
                />
                <td key={`amount-orb-${i}`}>
                  {this.state.orb[i].amount}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

}

AigisItemTable.propTypes = {
  orb: PropTypes.arrayOf(PropTypes.shape({
    amount: PropTypes.number.isRequired,
    classId: PropTypes.oneOf(Object.keys(ClassIcon)).isRequired,
  })),
  spirit: PropTypes.arrayOf(PropTypes.shape({
    amount: PropTypes.number.isRequired,
    label: PropTypes.oneOf(Object.keys(spiritText)).isRequired,
  })),
  unit: PropTypes.arrayOf(PropTypes.shape({
    amount: PropTypes.number.isRequired,
    classId: PropTypes.oneOf(Object.keys(ClassIcon)).isRequired,
    rarity: PropTypes.oneOf(Object.keys(rarityData)).isRequired,
  })),
};

AigisItemTable.defaultProps = {
  orb: [],
  spirit: [],
  unit: [],
};

export default AigisItemTable;
