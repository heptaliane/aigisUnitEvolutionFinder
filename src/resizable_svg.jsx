import React from 'react';
import PropTypes from 'prop-types';


class ResizableSVG extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      height: props.height,
      svg: props.svg,
      width: props.width,
    };

    this.setReferenceSVG = this.setReferenceSVG.bind(this);
  }

  componentDidMount() {
    this.resizeSVG();
  }

  componentDidUpdate() {
    this.resizeSVG();
  }

  setReferenceSVG(ref) {
    this.container = ref;
  }

  resizeSVG() {
    const svg = this.container.children[0];
    const height = svg.getAttribute('height');
    const width = svg.getAttribute('width');
    this.container.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const bbox = this.container.getBBox();
    if (this.state.height === 'auto') {
      this.container.setAttribute('height', bbox.height);
    }
    if (this.state.width === 'auto') {
      this.container.setAttribute('width', bbox.width);
    }
  }

  render() {
    return (
      <svg
        ref={this.setReferenceSVG}
        fill="currentColor"
        height={this.state.height}
        width={this.state.width}
      >
        {this.state.svg}
      </svg>
    );
  }

}

ResizableSVG.propTypes = {
  svg: PropTypes.node.isRequired,
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

ResizableSVG.defaultProps = {
  height: 'auto',
  width: 'auto',
};

export default ResizableSVG;
