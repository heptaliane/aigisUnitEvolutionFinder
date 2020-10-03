import React from 'react';
import PropTypes from 'prop-types';

import UnitController from './unit_controller.jsx';
import AigisItemTable from './aigis_item_table.jsx';
import rarityData from '../data/rarity.json';
import {
  cc_unit as ccData,
  kakusei_unit as kakuseiData,
  orb as orbData,
} from '../data/jobs.json';


const outerContainerStyle = {
  overflow: 'hidden',
  backgroundColor: '#c7bfb2',
};

const innerContainerStyle = {
  float: 'left',
  left: '50%',
  margin: 'auto',
  position: 'relative',
};

const controllerOuterStyle = {
  backgroundColor: '#690300',
  border: '7px double #bcad7d',
  float: 'left',
  left: '-50%',
  margin: '20px',
  padding: '20px',
  position: 'relative',
};

const controllerInnerStyle = {
  border: '5px solid #873230',
  borderRadius: '20px',
  backgroundColor: '#690300',
};

const tableStyle = {
  float: 'left',
  left: '-50%',
  margin: '20px',
  position: 'relative',
  textAlign: 'left',
};

const ccLevel = 0;
const kakuseiLevel1 = 1;
const kakuseiLevel2 = 2;
const nItems = 4;
const spiritIndex = 3;

const getRarityLabels = function(rarity, level, status) {
  if (level === ccLevel) {
    return rarityData[rarity].cc;
  }
  return status.slice(0, spiritIndex).map((state) => {
    return state ?
      'silver' :
      'gold';
  });
};

const getSpiritLabel = function(rarity, level, status) {
  if (level === kakuseiLevel1) {
    return 'kakusei1';
  } else if (level === kakuseiLevel2) {
    return 'kakusei2';
  } else if (rarityData[rarity].has_spirit && status) {
    return rarity;
  }
  return 'generic';
};

const getOrbList = function(classId, rarity, level) {
  if (level === ccLevel) {
    return [];
  }
  return orbData[classId].map((orbId) => {
    return {
      classId: String(orbId),
      amount: rarityData[rarity].orb,
    };
  });
};

const getSpiritList = function(rarity, level, status) {
  const spirits = [
    {
      label: getSpiritLabel(rarity, level, status[spiritIndex]),
      amount: 1,
    },
  ];

  if (level !== ccLevel) {
    const nSpirits = status.slice(0, spiritIndex).reduce((sum, stat) => {
      return stat ?
        sum + 1 :
        sum;
    }, 0);
    if (nSpirits > 0) {
      spirits.push({
        label: 'silver',
        amount: nSpirits,
      });
    }
  }

  return spirits.reverse();
};

const updateUnitLut = function(lut, id, rarity) {
  const lbl = [
    rarityData[rarity].rarity,
    id,
    rarity,
  ].join(',');
  lut[lbl] = lut[lbl] === undefined ?
    1 :
    lut[lbl] + 1;
};

const createUnitListFromLut = function(lut) {
  return Object.keys(lut).sort().
    map((lbl) => {
      const [
        id,
        rarity,
      ] = lbl.split(',').slice(1);
      return {
        amount: lut[lbl],
        classId: id,
        rarity: rarity,
      };
    });
};

const getUnitList = function({classId, rarity, level, status}) {
  if (level === ccLevel) {
    const ccRarity = getRarityLabels(rarity, level, status);
    const lut = ccData[classId].reduce((obj, id, i) => {
      updateUnitLut(obj, id, ccRarity[i]);
      return obj;
    }, {});

    return createUnitListFromLut(lut);
  }

  const ccRarity = getRarityLabels('silver', ccLevel, status);
  const lut = kakuseiData[classId].reduce((obj, kakuseiId, i) => {
    // Use CC sliver unit
    if (status[i]) {
      updateUnitLut(obj, kakuseiId, 'silver');
      ccData[kakuseiId].forEach((id, i) => {
        updateUnitLut(obj, id, ccRarity[i]);
      });

    // Use gold unit
    } else {
      updateUnitLut(obj, kakuseiId, 'gold');
    }
    return obj;
  }, {});

  return createUnitListFromLut(lut);
};

class UnitView extends React.Component {

  static getDerivedStateFromProps(props) {
    return props;
  }

  constructor(props) {
    super(props);
    this.state = {
      level: props.level,
      classId: props.classId,
      rarity: props.rarity,
      status: Array(nItems).fill(true),
    };
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  handleStateChange(name) {
    const updateIdx = name === 'spirit' ?
      spiritIndex :
      Number(name);
    const newStatus = this.state.status.map((s, i) => {
      return i === updateIdx ?
        !s :
        s;
    });
    this.setState({status: newStatus});
  }

  render() {
    return (
      <div style={outerContainerStyle}>
        <div style={innerContainerStyle}>
          <div style={controllerOuterStyle}>
            <div style={controllerInnerStyle}>
              <UnitController
                cc={this.state.status.slice(0, spiritIndex).map((_, i) => {
                  return this.state.level !== ccLevel && this.state.status[i];
                })}
                icon={
                  this.state.level === ccLevel ?
                    ccData[this.state.classId].map((i) => {
                      return String(i);
                    }) :
                    kakuseiData[this.state.classId].map((i) => {
                      return String(i);
                    })
                }
                immutable={[
                  this.state.level === ccLevel,
                  this.state.level === ccLevel,
                  this.state.level === ccLevel,
                  this.state.level !== ccLevel ||
                  !rarityData[this.state.rarity].has_spirit,
                ]}
                rarity={getRarityLabels(
                  this.state.rarity,
                  this.state.level,
                  this.state.status
                )}
                spirit={getSpiritLabel(
                  this.state.rarity,
                  this.state.level,
                  this.state.status[spiritIndex]
                )}
                onClick={this.handleStateChange}
              />
            </div>
          </div>
          <div style={tableStyle}>
            <AigisItemTable
              orb={getOrbList(
                this.state.classId,
                this.state.rarity,
                this.state.level
              )}
              spirit={getSpiritList(
                this.state.rarity,
                this.state.level,
                this.state.status
              )}
              unit={getUnitList({
                classId: this.state.classId,
                rarity: this.state.rarity,
                level: this.state.level,
                status: this.state.status,
              })}
            />
          </div>
        </div>
      </div>
    );
  }

}

UnitView.propTypes = {
  classId: PropTypes.oneOf(Array.from({length: kakuseiData.length}, (_, i) => {
    return String(i);
  })).isRequired,
  rarity: PropTypes.oneOf(Object.keys(rarityData)).isRequired,
  level: PropTypes.oneOf([
    ccLevel,
    kakuseiLevel1,
    kakuseiLevel2,
  ]),
};

UnitView.defaultProps = {
  level: kakuseiLevel1,
};

export default UnitView;
