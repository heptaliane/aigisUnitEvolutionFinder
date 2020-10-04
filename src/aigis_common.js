import ClassIcon from './class_icon.jsx';
import text from '../data/text_ja.json';
import rarityData from '../data/rarity.json';
import classData from '../data/jobs.json';


const aigisConstant = {
  ccLevel: 0,
  notFound: -1,
};

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

const hasItem = function(arr, item) {
  return arr.indexOf(item) !== aigisConstant.notFound;
}

const aigisDefault = {
  classId: null,
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
  baseLabel: classData.base_label,
  classId: getIndexArray(classData.base_label),
  icon: Object.keys(ClassIcon),
  implementedLevel: classData.label.map((arr) => {
    return arr.map(({level}) => {
      return level - 1;
    }).filter((level) => {
      return hasItem(aigisLevel.keys, level);
    });
  }),
  ruby: {
    selection: Object.keys(classData.ruby).reduce((obj, k) => {
      obj[classData.ruby[k].label] = k;
      return obj;
    }, {}),
    lut: Object.keys(classData.ruby).reduce((obj, k) => {
      obj[classData.ruby[k].label] = {
        level: classData.ruby[k].level,
        classId: classData.ruby[k].id,
      };
      return obj;
    }, {}),
  },
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

  hasItem: hasItem,
});
