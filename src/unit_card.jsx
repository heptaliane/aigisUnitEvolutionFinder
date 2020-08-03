import React from 'react';
import PropTypes from 'prop-types';
import StarIcon from 'bootstrap-icons/icons/star-fill.svg';


import rarityData from '../data/rarity.json';


const containerStyle = {
  borderRadius: '10px',
  padding: '10px',
  display: 'block',
  textAlign: 'center',
};
const borderStyle = {
  borderRadius: '10px',
  background: 'white',
};
const starContainerStyle = {
  textAlign: 'left',
  padding: '10px',
  margin: 'auto',
  width: '100%',
};
const starStyle = {
  marginLeft: '10px',
};
const iconContainerStyle = {
  textAlign: 'center',
  padding: '20%',
};
const footerStyle = {
  textAlign: 'center',
  fontWeight: 'bold',
};

const getColor = function(rarity) {
  const color = rarityData[rarity].color;
  return `linear-gradient(-45deg, ${color[0]}, ${color[1]})`;
};

class UnitCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      rarity: props.rarity,
      icon: props.icon,
      label: props.label,
      disabled: props.disabled,
    };
    this.size = props.size;

    this.handleClick = props.onClick.bind(this);
  }

  render() {
    return (
      <button
        disabled={this.state.disabled}
        style={
          Object.assign(
            {}, containerStyle,
            {background: getColor(this.state.rarity)}
          )
        }
        type="button"
        onClick={this.handleClick}
      >
        <div
          style={
            Object.assign({
              width: `${this.size}px`,
              height: `${this.size}px`,
            }, borderStyle)}
        >
          <div style={starContainerStyle}>
            {Array(rarityData[this.state.rarity].rarity).fill(null).
              map((_, i) => {
                return (
                  <StarIcon
                    key={`star-${i}`}
                    style={starStyle}
                  />
                );
              })}
          </div>
          <div style={iconContainerStyle}>
            {this.state.icon}
          </div>
          <div style={footerStyle}>
            {this.state.label}
          </div>
        </div>
      </button>
    );
  }

}

UnitCard.propTypes = {
  rarity: PropTypes.oneOf(Object.keys(rarityData)).isRequired,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  label: PropTypes.string,
  size: PropTypes.number,
  onClick: PropTypes.func,
};

UnitCard.defaultProps = {
  disabled: false,
  icon: '',
  label: '',
  size: 200,
  onClick: (args) => {
    return console.log(args);
  },
};

export default UnitCard;
