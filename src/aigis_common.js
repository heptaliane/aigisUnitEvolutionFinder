import ClassIcon from './class_icon.jsx';
import text from '../data/text_ja.json';
import rarityData from '../data/rarity.json';


const deepFreeze = function(obj) {
  if (Object.isFrozen(obj)) {
    return obj;
  }

  const keys = Object.keys(obj);
  for (const k of keys) {
    obj[k] = obj[k] instanceof Object ?
      deepFreeze(obj[k]) :
      obj[k];
  }
  return Object.freeze(obj);
};

const getIndexArray = function(arr) {
  return Array.from({length: arr.length}, (_, i) => {
    return i;
  });
};


const aigisConstant = {
  ccLevel: 0,
  notFound: -1,
};

const aigisDefault = {
  rarity: 'black',
  level: 1,
  handler: function(args) {
    console.log(args);
  },
};

const aigisRarity = {
  data: rarityData,
  keys: Object.keys(rarityData),
};

const aigisLevel = {
  label: text.header.level,
  keys: getIndexArray(text.header.level),
};

const aigisClass = {
  icon: Object.keys(ClassIcon),
};

const aigisSpirit = {
  label: text.spirit,
  keys: Object.keys(text.spirit),
  rarity: Object.keys(text.spirit).reduce((obj, key) => {
    if (aigisRarity.data[key] === undefined) {
      obj[key] = 'black';
    } else {
      obj[key] = key;
    }
    return obj;
  }, {}),
};

export default deepFreeze({
  constant: aigisConstant,

  default: aigisDefault,

  rarity: aigisRarity,

  level: aigisLevel,

  spirit: aigisSpirit,

  text: text,

  unitClass: aigisClass,

  checkValidRarity: function(level, rarity) {
    if (aigisRarity.data[rarity] === undefined) {
      return false;
    }
    if (level === this.ccLevel) {
      return aigisRarity.data[rarity].cc !== null;
    }
    return aigisRarity.data[rarity].orb !== null;
  },
});
