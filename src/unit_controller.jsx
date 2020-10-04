import React from 'react';
import PropTypes from 'prop-types';

import UnitCard from './unit_card.jsx';
import ClassIcon from './class_icon.jsx';
import common from './aigis_common.js';


const iconSize = 60;
const nunit = 3;

const containerStyle = {
  display: 'grid',
  padding: '20px',
  gridGap: '20px',
  gridTemplateColumns: 'fit-content(100px) fit-content(100px)',
  gridTemplateRows: 'fit-content(100px) fit-content(100px)',
};

class UnitController extends React.Component {

  static getDerivedStateFromProps(props) {
    return props;
  }

  constructor(props) {
    super(props);

    this.state = {
      icon: props.icon,
      rarity: props.rarity,
      cc: props.cc,
      immutable: props.immutable,
      spirit: props.spirit,
    };

    this.callback = props.onClick;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(target) {
    this.callback(target.parentNode.getAttribute('name'));
  }

  render() {
    return (
      <div style={containerStyle}>
        {Array(nunit).fill(null).
          map((_, i) => {
            return (
              <div
                key={`div-${i}`}
                name={String(i)}
              >
                <UnitCard
                  key={`card-${i}`}
                  cc={this.state.cc[i]}
                  disabled={this.state.immutable[i]}
                  icon={
                    React.createElement(ClassIcon[this.state.icon[i]], {
                      height: iconSize,
                      width: iconSize,
                    }, null)
                  }
                  label={
                    this.state.cc[i] ?
                      common.unitClass.label[this.state.icon[i]][1].label :
                      common.unitClass.baseLabel[this.state.icon[i]]
                  }
                  rarity={this.state.rarity[i]}
                  onClick={this.handleClick}
                />
              </div>
            );
          })}
        <div name="spirit">
          <UnitCard
            disabled={this.state.immutable[this.state.immutable.length - 1]}
            label={common.spirit.label[this.state.spirit]}
            rarity={common.spirit.rarity[this.state.spirit]}
            onClick={this.handleClick}
          />
        </div>
      </div>
    );
  }

}

UnitController.propTypes = {
  cc: PropTypes.arrayOf(PropTypes.bool),
  icon: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(ClassIcon))),
  immutable: PropTypes.arrayOf(PropTypes.bool),
  rarity: PropTypes.arrayOf(PropTypes.oneOf(common.rarity.keys)),
  spirit: PropTypes.oneOf(common.spirit.keys),
  onClick: PropTypes.func,
};

UnitController.defaultProps = {
  cc: [],
  icon: [],
  immutable: [],
  rarity: [],
  spirit: common.default.rarity,
  onClick: common.default.handler,
};

export default UnitController;
