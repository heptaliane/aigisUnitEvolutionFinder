import {base_label as blbls} from '../data/jobs.json';
import ilbls from '../data/icons.json';


const icons = Object.entries(ilbls).map(([
  basename,
  filename,
]) => {
  const idx = blbls.indexOf(basename);
  return [
    idx,
    require(`../icons/prod/${filename}.svg`),
  ];
}).
  reduce((obj, [
    idx,
    svg,
  ]) => {
    obj[idx] = svg.default;
    return obj;
  }, {});

Object.freeze(icons);

export default icons;
