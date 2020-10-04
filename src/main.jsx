import React from 'react';
import {render} from 'react-dom';

import ContentHeader from './content_header.jsx';
import UnitView from './unit_view.jsx';

import common from './aigis_common.js';

import 'bootstrap/dist/css/bootstrap.min.css';


const bgColor = '#c7bfb2';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.loadQuery();
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    document.body.style.background = bgColor;
    this.updateQuery();
  }

  componentDidUpdate() {
    this.updateQuery();
  }

  loadQuery() {
    const params = new URLSearchParams(location.search);
    const classId = common.unitClass.baseLabel.indexOf(params.get('class'));
    const level = common.level.label.indexOf(params.get('mode'));
    const rarity = params.get('rarity');
    return {
      classId: classId === common.constant.notFound ?
        common.default.classId :
        classId,
      level: level === common.constant.notFound ?
        common.default.level :
        level,
      rarity: common.checkValidRarity(level, rarity) ?
        rarity :
        common.default.rarity,
    };
  }

  updateQuery() {
    let url = `${location.protocol}//${location.host}${location.pathname}`;
    if (this.state.classId !== null) {
      const params = new URLSearchParams(location.search);
      params.set('class', common.unitClass.baseLabel[this.state.classId]);
      params.set('mode', common.level.label[this.state.level]);
      params.set('rarity', this.state.rarity);
      url = `${url}?${params.toString()}`;
    }
    window.history.pushState({path: url}, '', url);
  }

  handleChange(state) {
    const newState = Object.assign({}, this.state, state);
    if (!common.checkValidRarity(newState.level, newState.rarity)) {
      newState.rarity = common.default.rarity;
    }
    console.log(newState);
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <ContentHeader
          classId={this.state.classId}
          level={this.state.level}
          rarity={this.state.rarity}
          onChange={this.handleChange}
        />
        {
          this.state.classId !== null &&
          <div style={{textAlign: 'center'}}>
            <UnitView
              classId={String(this.state.classId)}
              level={this.state.level}
              rarity={this.state.rarity}
            />
          </div>
        }
      </div>
    );
  }

}

render(
  <App />,
  document.getElementById('container')
);
