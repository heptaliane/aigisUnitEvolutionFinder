import React from 'react';
import PropTypes from 'prop-types';
import StarIcon from 'bootstrap-icons/icons/star-fill.svg';

import CCIcon from '../icons/prod/cc.svg';
import common from './aigis_common.js';


const gradientDegree = -45;
const gradientRepeat = 2.5;

const containerStyle = {
  borderRadius: '10px',
  color: 'black',
  padding: '10px',
  position: 'relative',
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
  height: '60%',
  display: 'flex',
  justifyContent: 'center',
};
const iconStyle = {
  marginTop: 'auto',
  marginBottom: 'auto',
};
const ccContainerStyle = {
  paddingTop: '35%',
};
const ccStyle = {
  margin: 'auto',
  height: '20px',
  width: '20px',
};
const footerStyle = {
  textAlign: 'center',
  fontWeight: 'bold',
};

class UnitCard extends React.Component {

  static getDerivedStateFromProps(props) {
    return props;
  }

  constructor(props) {
    super(props);

    this.state = {
      cc: props.cc,
      disabled: props.disabled,
      icon: props.icon,
      label: props.label,
      rarity: props.rarity,
    };
    this.size = props.size;

    this.onClick = props.onClick;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick({currentTarget}) {
    this.onClick(currentTarget);
  }

  render() {
    return (
      <button
        disabled={this.state.disabled}
        style={
          Object.assign(
            {}, containerStyle,
            {
              background: common.gradientColor({
                colors: common.rarity.data[this.state.rarity].color,
                degree: gradientDegree,
                repeat: gradientRepeat,
              }),
            },
            {
              cursor: this.state.disabled ?
                'not-allowed' :
                'pointer',
            }
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
            {Array(common.rarity.data[this.state.rarity].rarity).fill(null).
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
            <div style={iconStyle}>
              {this.state.icon}
            </div>
            {
              this.state.cc &&
              <div style={ccContainerStyle}>
                <CCIcon style={ccStyle} />
              </div>
            }
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
  rarity: PropTypes.oneOf(common.rarity.keys).isRequired,
  cc: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  label: PropTypes.string,
  size: PropTypes.number,
  onClick: PropTypes.func,
};

UnitCard.defaultProps = {
  cc: false,
  disabled: false,
  icon: '',
  label: '',
  size: 200,
  onClick: common.default.handler,
};

export default UnitCard;
