import React from 'react';

import ResizableSVG from './resizable_svg.jsx';

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
    const svgNode = React.createElement(svg.default, null, null);
    obj[idx] = (props) => {
      const newProps = Object.assign({svg: svgNode}, props);
      return React.createElement(ResizableSVG, newProps, null);
    };
    return obj;
  }, {});

Object.freeze(icons);

export default icons;
