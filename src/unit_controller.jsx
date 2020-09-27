import React from 'react';
import PropTypes from 'prop-types';

import UnitCard from './unit_card.jsx';
import ClassIcon from './class_icon.jsx';

import rarityData from '../data/rarity.json';
import {
  base_label as blbls,
  label as lbls,
} from '../data/jobs.json';
import {spirit as spiritText} from '../data/text_ja.json';


const iconSize = 60;

const containerStyle = {
  display: 'grid',
  padding: '20px',
  gridGap: '20px',
  gridTemplateColumns: 'fit-content(100px) fit-content(100px)',
  gridTemplateRows: 'fit-content(100px) fit-content(100px)',
};

const nunit = 3;
const spiritRarity = Object.keys(spiritText).reduce((obj, key) => {
  if (rarityData[key] === undefined) {
    obj[key] = 'black';
  } else {
    obj[key] = key;
  }
  return obj;
}, {});

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
                      lbls[this.state.icon[i]][1].label :
                      blbls[this.state.icon[i]]
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
            label={spiritText[this.state.spirit]}
            rarity={spiritRarity[this.state.spirit]}
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
  rarity: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(rarityData))),
  spirit: PropTypes.oneOf(Object.keys(spiritText)),
  onClick: PropTypes.func,
};

UnitController.defaultProps = {
  cc: [],
  icon: [],
  immutable: [],
  rarity: [],
  spirit: Object.keys(spiritText)[0],
  onClick: (args) => {
    return console.log(args);
  },
};

export default UnitController;
