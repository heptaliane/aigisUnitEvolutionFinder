import ClassIcon from './class_icon.jsx';
import text from '../data/text_ja.json';
import rarityData from '../data/rarity.json';
import classData from '../data/jobs.json';


const maxPercentage = 100;
const aigisConstant = {
  ccLevel: 0,
  kakuseiLevel1: 1,
  kakuseiLevel2: 2,
  numRequireUnits: 3,
  spiritIndex: 3,
  kakuseiRarityWithFlag: 'silver',
  kakuseiRarityWithoutFlag: 'gold',
  kakusei1SpiritKey: 'kakusei1',
  kakusei2SpiritKey: 'kakusei2',
  ccGenericSpiritKey: 'generic',
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
};

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
  label: classData.label,
  keys: Object.keys(classData.base_label),
  require: {
    cc: classData.cc_unit,
    kakusei: classData.kakusei_unit,
    orb: classData.orb,
  },
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

class SortedLabelCounter {

  constructor() {
    this.delimiter = ',';
    this.cnt = {};
  }

  update(keys) {
    const sortKey = keys.join(this.delimiter);
    this.cnt[sortKey] = this.cnt[sortKey] === undefined ?
      1 :
      this.cnt[sortKey] + 1;
  }

  parse() {
    return Object.keys(this.cnt).sort().
      map((sortKey) => {
        return {
          keys: sortKey.split(this.delimiter),
          count: this.cnt[sortKey],
        };
      });
  }

}

class RequiredUnitCounter extends SortedLabelCounter {

  update({rarity, classId}) {
    super.update([
      aigisRarity.data[rarity].rarity,
      classId,
      rarity,
    ]);
  }

  parse() {
    return super.parse().map(({keys, count}) => {
      const [
        classId,
        rarity,
      ] = keys.slice(1);
      return {
        amount: count,
        classId: classId,
        rarity: rarity,
      };
    });
  }

}

export default deepFreeze({
  constant: aigisConstant,

  default: aigisDefault,

  rarity: aigisRarity,

  level: aigisLevel,

  spirit: aigisSpirit,

  text: text,

  unitClass: aigisClass,

  hasItem: hasItem,

  checkValidRarity: function(level, rarity) {
    if (aigisRarity.data[rarity] === undefined) {
      return false;
    }
    if (level === aigisConstant.ccLevel) {
      return aigisRarity.data[rarity].cc !== null;
    }
    return aigisRarity.data[rarity].orb !== null;
  },

  gradientColor: function({colors, degree, repeat}) {
    const arr = colors.concat();
    const colorStr = `${arr.join(',')},${arr.reverse().join(',')}`;
    const ratio = Math.round(maxPercentage / repeat);
    return `repeating-linear-gradient(${degree}deg, ${colorStr} ${ratio}%)`;
  },

  getDisplayedUnitRarity: function(rarity, level, flags) {
    if (level === aigisConstant.ccLevel) {
      return aigisRarity.data[rarity].cc;
    }
    return flags.slice(0, aigisConstant.numRequireUnits).map((flag) => {
      return flag ?
        aigisConstant.kakuseiRarityWithFlag :
        aigisConstant.kakuseiRarityWithoutFlag;
    });
  },

  getDisplayedSpirit: function(rarity, level, useGeneric) {
    if (level === aigisConstant.kakuseiLevel1) {
      return aigisConstant.kakusei1SpiritKey;
    } else if (level === aigisConstant.kakuseiLevel2) {
      return aigisConstant.kakusei2SpiritKey;
    } else if (aigisRarity.data[rarity].has_spirit && !useGeneric) {
      return rarity;
    }
    return aigisConstant.ccGenericSpiritKey;
  },

  getRequiredUnit: function({classId, rarity, level, flags}) {
    const cnt = new RequiredUnitCounter();
    const ccRarity = this.getDisplayedUnitRarity(
      level === aigisConstant.ccLevel ?
        rarity :
        aigisConstant.kakuseiRarityWithFlag,
      aigisConstant.ccLevel,
      flags
    );

    if (level === aigisConstant.ccLevel) {
      aigisClass.require.cc[classId].forEach((id, i) => {
        cnt.update({
          rarity: ccRarity[i],
          classId: id,
        });
      });

    } else {
      aigisClass.require.kakusei[classId].forEach((kakuseiId, i) => {
        // Use cc silver unit
        if (flags[i]) {
          cnt.update({
            rarity: aigisConstant.kakuseiRarityWithFlag,
            classId: kakuseiId,
          });
          aigisClass.require.cc[kakuseiId].forEach((id, i) => {
            cnt.update({
              rarity: ccRarity[i],
              classId: id,
            });
          });
        // Use gold unit
        } else {
          cnt.update({
            rarity: aigisConstant.kakuseiRarityWithoutFlag,
            classId: kakuseiId,
          });
        }
      });
    }

    return cnt.parse();
  },

  getRequiredSpirit: function(rarity, level, flags) {
    const spiritIndex = aigisConstant.spiritIndex;
    const spirits = [
      {
        label: this.getDisplayedSpirit(rarity, level, flags[spiritIndex]),
        amount: 1,
      },
    ];

    if (level !== aigisConstant.ccLevel) {
      const nSpirits = flags.slice(0, spiritIndex).reduce((sum, flag) => {
        return flag ?
          sum + 1 :
          sum;
      }, 0);
      if (nSpirits > 0) {
        spirits.push({
          label: aigisConstant.kakuseiRarityWithFlag,
          amount: nSpirits,
        });
      }
    }

    return spirits.reverse();
  },

  getRequiredOrb: function(classId, rarity, level) {
    if (level === aigisConstant.ccLevel) {
      return [];
    }
    return aigisClass.require.orb[classId].map((orbId) => {
      return {
        classId: String(orbId),
        amount: aigisRarity.data[rarity].orb,
      };
    });
  },

  getClassLabelWithLevel: function(classId, targetLevel) {
    return aigisClass.label[classId].filter(({level}) => {
      return level === targetLevel;
    }).map(({label}) => {
      return label;
    });
  }
});
