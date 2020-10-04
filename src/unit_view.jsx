import React from 'react';
import PropTypes from 'prop-types';

import UnitController from './unit_controller.jsx';
import AigisItemTable from './aigis_item_table.jsx';
import common from './aigis_common.js';


const outerContainerStyle = {
  overflow: 'hidden',
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

const ccLevel = common.constant.ccLevel;
const spiritIndex = common.constant.spiritIndex;

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
      status: Array(common.constant.numRequireUnits + 1).fill(true),
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
                    common.unitClass.require.cc[this.state.classId].
                      map((i) => {
                        return String(i);
                      }) :
                    common.unitClass.require.kakusei[this.state.classId].
                      map((i) => {
                        return String(i);
                      })
                }
                immutable={[
                  this.state.level === ccLevel,
                  this.state.level === ccLevel,
                  this.state.level === ccLevel,
                  this.state.level !== ccLevel ||
                  !common.rarity.data[this.state.rarity].has_spirit,
                ]}
                rarity={common.getDisplayedUnitRarity(
                  this.state.rarity,
                  this.state.level,
                  this.state.status
                )}
                spirit={common.getDisplayedSpirit(
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
              orb={common.getRequiredOrb(
                this.state.classId,
                this.state.rarity,
                this.state.level
              )}
              spirit={common.getRequiredSpirit(
                this.state.rarity,
                this.state.level,
                this.state.status
              )}
              unit={common.getRequiredUnit({
                classId: this.state.classId,
                rarity: this.state.rarity,
                level: this.state.level,
                flags: this.state.status,
              })}
            />
          </div>
        </div>
      </div>
    );
  }

}

UnitView.propTypes = {
  classId: PropTypes.oneOf(common.unitClass.keys).isRequired,
  rarity: PropTypes.oneOf(common.rarity.keys).isRequired,
  level: PropTypes.oneOf(common.level.keys),
};

UnitView.defaultProps = {
  level: common.default.level,
};

export default UnitView;
