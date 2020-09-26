import React from 'react';
import PropTypes from 'prop-types';
import StarIcon from 'bootstrap-icons/icons/star-fill.svg';

import rarityData from '../../data/rarity.json';


const RarityCell = function(props) {
  const nStar = rarityData[props.rarity].rarity;
  return (
    <td>
      {Array(nStar).fill(null).
        map((_, i) => {
          return <StarIcon key={`star-${i}`} />;
        })}
    </td>
  );
};

RarityCell.propTypes = {
  rarity: PropTypes.oneOf(Object.keys(rarityData)).isRequired,
};

export default RarityCell;
